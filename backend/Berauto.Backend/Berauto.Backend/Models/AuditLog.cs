using System;

namespace Berauto.Models;

/// <summary>
/// One row per SaveChanges-tracked entity change. Populated automatically by
/// AuditSaveChangesInterceptor — never write to this directly.
/// </summary>
public partial class AuditLog
{
    public int Id { get; set; }

    public DateTime Timestamp { get; set; }

    /// <summary>The acting user's id from the JWT, or null for unauthenticated/system actions.</summary>
    public int? UserId { get; set; }

    /// <summary>Denormalised user email so deleted users still show in old log rows.</summary>
    public string? UserEmail { get; set; }

    /// <summary>The CLR type name of the changed entity, e.g. "Car", "Rental", "User".</summary>
    public string EntityType { get; set; } = null!;

    /// <summary>Primary key of the changed row, stringified. Comma-joined for composite keys.</summary>
    public string? EntityId { get; set; }

    /// <summary>"Insert" | "Update" | "Delete".</summary>
    public string Action { get; set; } = null!;

    /// <summary>
    /// JSON describing the change.
    ///   Insert  → full new row.
    ///   Update  → { field: { old: ..., new: ... } } for each modified field only.
    ///   Delete  → full pre-delete row.
    /// Sensitive fields (anything containing "Password") are omitted.
    /// </summary>
    public string Changes { get; set; } = null!;
}
