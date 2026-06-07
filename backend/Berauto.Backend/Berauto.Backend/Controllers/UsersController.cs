
using Berauto.Backend.DTO;
using Berauto.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Berauto.Backend.Controllers
{
    [Authorize]                              // any authenticated user — no role restriction
    [ApiController]
    [Route("api/[controller]")]              // → /api/Users
    public class UsersController : ControllerBase
    {
        private readonly CarRentalDbContext _db;  // ← rename to YOUR DbContext class name
        public UsersController(CarRentalDbContext db) => _db = db;

        // Helper: extract the current user's Id from JWT claims.
        private int? CurrentUserId()
        {
            var raw = User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? User.FindFirstValue("sub");
            return int.TryParse(raw, out var id) ? id : null;
        }

        // GET /api/Users/me — return the current user's profile.
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

        // PUT /api/Users/me — update only Phone and Address.
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

            // Whitelisted updates only — Role, Email, PasswordHash, DrivingLicence stay untouched.
            u.Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim();
            u.Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim();

            await _db.SaveChangesAsync();
            return ToDto(u);
        }

        private static UserProfileDto ToDto(/* your User entity type */ dynamic u) => new UserProfileDto
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