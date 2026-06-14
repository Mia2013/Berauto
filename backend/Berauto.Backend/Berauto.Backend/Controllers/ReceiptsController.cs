using Berauto.Backend.DTOs;
using Berauto.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Berauto.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReceiptsController : ControllerBase
    {
        private readonly DbManager _dbManager;

        public ReceiptsController(DbManager dbManager)
        {
            _dbManager = dbManager;
        }

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private bool IsStaff =>
            User.IsInRole(RoleName.Admin) || User.IsInRole(RoleName.Officer);

        // GET: api/receipts/mine
        [HttpGet("mine")]
        public ActionResult<List<ReceiptDto>> GetMine()
        {
            return Ok(_dbManager.GetReceiptsByUser(CurrentUserId).Select(DtoMapper.ToDto));
        }

        // GET: api/receipts/{id}
        [HttpGet("{id}")]
        public ActionResult<ReceiptDto> GetById(int id)
        {
            var r = _dbManager.GetReceiptById(id);
            if (r == null) return NotFound();
            if (!IsStaff && r.UserId != CurrentUserId) return Forbid();
            return Ok(DtoMapper.ToDto(r));
        }

        // GET: api/receipts/by-rental/{rentalId}
        [HttpGet("by-rental/{rentalId}")]
        public ActionResult<ReceiptDto> GetByRentalId(int rentalId)
        {
            var r = _dbManager.GetReceiptByRentalId(rentalId);
            if (r == null) return NotFound();
            if (!IsStaff && r.UserId != CurrentUserId) return Forbid();
            return Ok(DtoMapper.ToDto(r));
        }
    }
}
