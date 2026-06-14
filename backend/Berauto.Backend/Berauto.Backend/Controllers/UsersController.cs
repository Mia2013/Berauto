using Berauto.Backend.DTOs;
using Berauto.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Berauto.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DbManager _dbManager;
        private readonly CarRentalDbContext _db;

        public UsersController(DbManager dbManager, CarRentalDbContext db)
        {
            _dbManager = dbManager;
            _db = db;
        }

        private int? CurrentUserId()
        {
            var raw = User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? User.FindFirstValue("sub");
            return int.TryParse(raw, out var id) ? id : null;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDto>> GetMe()
        {
            var id = CurrentUserId();
            if (id is null) return Unauthorized();

            var u = await _db.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (u is null) return NotFound();

            return ToDto(u);
        }

        [HttpPut("me")]
        public async Task<ActionResult<UserProfileDto>> UpdateMe([FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var id = CurrentUserId();
            if (id is null) return Unauthorized();

            var u = await _db.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (u is null) return NotFound();

            u.Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim();
            u.Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim();

            await _db.SaveChangesAsync();
            return ToDto(u);
        }

        // GET: api/Users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public ActionResult<List<UserDto>> GetAllUsers()
        {
            var users = _dbManager.GetAllUsers();
            return Ok(users.Select(DtoMapper.ToDto));
        }

        // DELETE: api/Users/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult DeleteUser(int id)
        {
            try
            {
                _dbManager.DeleteUser(id);
                return Ok(new { message = "Felhasználó sikeresen törölve." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserProfileDto>> AdminUpdateUser(int id, [FromBody] AdminUpdateUserDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var u = await _db.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (u == null) return NotFound(new { message = "A szerkeszteni kívánt felhasználó nem található." });

        
            u.Name = dto.Name.Trim();
            u.Email = dto.Email.Trim().ToLower();
            u.Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim();
            u.Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim();
            u.DrivingLicence = string.IsNullOrWhiteSpace(dto.DrivingLicence) ? null : dto.DrivingLicence.Trim();
            u.RoleId = dto.RoleId;

            await _db.SaveChangesAsync();
            return ToDto(u);
        }
        private static UserProfileDto ToDto(dynamic u) => new UserProfileDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Phone = u.Phone,
            Address = u.Address,
            DrivingLicence = u.DrivingLicence,
            Role = u.Role?.Name ?? "",
        };
    }
}