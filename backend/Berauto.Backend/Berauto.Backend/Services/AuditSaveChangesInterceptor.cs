using Berauto.Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Security.Claims;
using System.Text.Json;

namespace Berauto.Backend.Services;

/// <summary>
/// Captures every Add/Update/Delete on the DbContext and writes an AuditLog row.
/// Reads the acting user from the current HTTP request's JWT claims.
/// </summary>
public class AuditSaveChangesInterceptor : SaveChangesInterceptor
{
    private readonly IHttpContextAccessor _httpAccessor;
    private readonly List<Pending> _pending = new();

    public AuditSaveChangesInterceptor(IHttpContextAccessor httpAccessor)
    {
        _httpAccessor = httpAccessor;
    }

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData, InterceptionResult<int> result)
    {
        Stage(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData, InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        Stage(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    public override int SavedChanges(SaveChangesCompletedEventData eventData, int result)
    {
        Persist(eventData.Context);
        return base.SavedChanges(eventData, result);
    }

    public override async ValueTask<int> SavedChangesAsync(
        SaveChangesCompletedEventData eventData, int result,
        CancellationToken cancellationToken = default)
    {
        await PersistAsync(eventData.Context, cancellationToken);
        return await base.SavedChangesAsync(eventData, result, cancellationToken);
    }

    // Internals

    private void Stage(DbContext? ctx)
    {
        _pending.Clear();
        if (ctx == null) return;

        // Make sure ChangeTracker has up-to-date state.
        ctx.ChangeTracker.DetectChanges();

        foreach (var entry in ctx.ChangeTracker.Entries())
        {
            // Never audit the audit log itself — would recurse forever.
            if (entry.Entity is AuditLog) continue;
            if (entry.State is not (EntityState.Added or EntityState.Modified or EntityState.Deleted))
                continue;

            // For Modified/Deleted the PK is already set; for Added it's populated by EF
            // after the actual INSERT runs, so we re-read it in Persist().
            var capturedId = entry.State == EntityState.Added ? null : GetPk(entry);

            _pending.Add(new Pending(
                Entry: entry,
                State: entry.State,
                EntityType: entry.Metadata.ClrType.Name,
                CapturedId: capturedId,
                Changes: SerializeChanges(entry)));
        }
    }

    private void Persist(DbContext? ctx)
    {
        if (ctx == null || _pending.Count == 0) return;
        var logs = BuildLogs();
        if (logs.Count == 0) return;

        ctx.Set<AuditLog>().AddRange(logs);
        // This nested save re-enters Stage(), but every entry is an AuditLog so the
        // pending list stays empty — no infinite recursion.
        ctx.SaveChanges();
    }

    private async Task PersistAsync(DbContext? ctx, CancellationToken ct)
    {
        if (ctx == null || _pending.Count == 0) return;
        var logs = BuildLogs();
        if (logs.Count == 0) return;

        ctx.Set<AuditLog>().AddRange(logs);
        await ctx.SaveChangesAsync(ct);
    }

    private List<AuditLog> BuildLogs()
    {
        var (userId, email) = CurrentUser();
        var now = DateTime.UtcNow;
        var logs = new List<AuditLog>(_pending.Count);

        foreach (var p in _pending)
        {
            // For Added entries the PK is now populated post-save.
            var entityId = p.CapturedId ?? GetPk(p.Entry);

            logs.Add(new AuditLog
            {
                Timestamp = now,
                UserId = userId,
                UserEmail = email,
                EntityType = p.EntityType,
                EntityId = entityId,
                Action = p.State switch
                {
                    EntityState.Added => "Insert",
                    EntityState.Modified => "Update",
                    EntityState.Deleted => "Delete",
                    _ => "Unknown",
                },
                Changes = p.Changes,
            });
        }
        _pending.Clear();
        return logs;
    }

    private static string? GetPk(EntityEntry entry)
    {
        try
        {
            var key = entry.Metadata.FindPrimaryKey();
            if (key == null) return null;
            var parts = key.Properties
                .Select(p => entry.Property(p.Name).CurrentValue?.ToString() ?? "")
                .ToList();
            return string.Join(",", parts);
        }
        catch
        {
            return null;
        }
    }

    private static string SerializeChanges(EntityEntry entry)
    {
        var opts = new JsonSerializerOptions { WriteIndented = false };

        switch (entry.State)
        {
            case EntityState.Added:
            {
                var dict = entry.Properties
                    .Where(p => !IsSensitive(p.Metadata.Name))
                    .ToDictionary(p => p.Metadata.Name, p => SafeValue(p.CurrentValue));
                return JsonSerializer.Serialize(dict, opts);
            }
            case EntityState.Deleted:
            {
                var dict = entry.Properties
                    .Where(p => !IsSensitive(p.Metadata.Name))
                    .ToDictionary(p => p.Metadata.Name, p => SafeValue(p.OriginalValue));
                return JsonSerializer.Serialize(dict, opts);
            }
            case EntityState.Modified:
            {
                var diffs = new Dictionary<string, object?>();
                foreach (var prop in entry.Properties)
                {
                    if (!prop.IsModified) continue;
                    if (IsSensitive(prop.Metadata.Name)) continue;

                    var oldVal = SafeValue(prop.OriginalValue);
                    var newVal = SafeValue(prop.CurrentValue);
                    if (Equals(oldVal, newVal)) continue; 

                    diffs[prop.Metadata.Name] = new { old = oldVal, @new = newVal };
                }
                return JsonSerializer.Serialize(diffs, opts);
            }
            default:
                return "{}";
        }
    }

    private static object? SafeValue(object? v)
    {
        if (v is null) return null;
        var t = v.GetType();
        if (t.IsPrimitive
            || v is string
            || v is decimal
            || v is DateTime
            || v is DateTimeOffset
            || v is Guid
            || v is DateOnly
            || v is TimeOnly)
        {
            return v;
        }
        return v.ToString();
    }

    private static bool IsSensitive(string propertyName)
        => propertyName.Contains("Password", StringComparison.OrdinalIgnoreCase);

    private (int? userId, string? email) CurrentUser()
    {
        var ctx = _httpAccessor.HttpContext;
        if (ctx?.User?.Identity?.IsAuthenticated != true) return (null, null);

        var idStr = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);
        int? id = int.TryParse(idStr, out var parsed) ? parsed : (int?)null;
        var email = ctx.User.FindFirstValue(ClaimTypes.Email);
        return (id, email);
    }

    private record Pending(
        EntityEntry Entry,
        EntityState State,
        string EntityType,
        string? CapturedId,
        string Changes);
}
