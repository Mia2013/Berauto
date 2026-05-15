using Berauto.Backend.DTOs;
using Berauto.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Berauto.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Officer")]
    public class AuditLogController : ControllerBase
    {
        private readonly CarRentalDbContext _db;

        public AuditLogController(CarRentalDbContext db)
        {
            _db = db;
        }

        // GET: api/auditlog?entityType=Car&action=Update&userId=2&from=2026-05-01&to=2026-05-31&page=1&pageSize=50
        [HttpGet]
        public ActionResult<AuditLogPage> GetLogs(
            [FromQuery] string? entityType,
            [FromQuery] string? action,
            [FromQuery] int? userId,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 50;
            if (pageSize > 500) pageSize = 500;

            IQueryable<AuditLog> q = _db.AuditLogs.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(entityType))
                q = q.Where(l => l.EntityType == entityType);
            if (!string.IsNullOrWhiteSpace(action))
                q = q.Where(l => l.Action == action);
            if (userId.HasValue)
                q = q.Where(l => l.UserId == userId.Value);
            if (from.HasValue)
                q = q.Where(l => l.Timestamp >= from.Value);
            if (to.HasValue)
                q = q.Where(l => l.Timestamp <= to.Value);

            var total = q.Count();
            var items = q
                .OrderByDescending(l => l.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(l => DtoMapper.ToDto(l))
                .ToList();

            return Ok(new AuditLogPage
            {
                Total = total,
                Page = page,
                PageSize = pageSize,
                Items = items,
            });
        }
    }
}
