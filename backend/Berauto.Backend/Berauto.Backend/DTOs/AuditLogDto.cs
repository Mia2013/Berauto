namespace Berauto.Backend.DTOs
{
    public class AuditLogDto
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public int? UserId { get; set; }
        public string? UserEmail { get; set; }
        public string EntityType { get; set; } = null!;
        public string? EntityId { get; set; }
        public string Action { get; set; } = null!;
        public string Changes { get; set; } = null!;
    }

    public class AuditLogPage
    {
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public List<AuditLogDto> Items { get; set; } = new();
    }
}
