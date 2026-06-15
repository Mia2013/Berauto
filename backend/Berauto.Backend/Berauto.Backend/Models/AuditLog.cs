using System;

namespace Berauto.Backend.Models;

public partial class AuditLog
{
    public int Id { get; set; }

    public DateTime Timestamp { get; set; }

    public int? UserId { get; set; }

    public string? UserEmail { get; set; }

    public string EntityType { get; set; } = string.Empty;

    public string? EntityId { get; set; }

    public string Action { get; set; } = string.Empty;

    public string Changes { get; set; } = string.Empty;
}
