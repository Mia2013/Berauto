using Azure.Core;
using Berauto.Backend.DTOs;
using Berauto.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Berauto.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly DbManager _dbManager;
        private readonly IPasswordHasher<User> _hasher;

        public AuthController(IConfiguration config, DbManager dbManager, IPasswordHasher<User> hasher)
        {
            _config = config;
            _dbManager = dbManager;
            _hasher = hasher;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public ActionResult<AuthResponse> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            if (_dbManager.GetUserByEmail(request.Email) != null)
                return Conflict(new { message = "Email is already in use." });

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address,
                DrivingLicence = request.DrivingLicence,
                RoleId = RoleId.Client
            };
            user.PasswordHash = _hasher.HashPassword(user, request.Password);

            _dbManager.AddUser(user);

            var saved = _dbManager.GetUserByEmail(user.Email)!;
            var token = GenerateToken(saved);

            return Ok(new AuthResponse
            {
                Token = token,
                User = DtoMapper.ToDto(saved)
            });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult<AuthResponse> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var user = _dbManager.GetUserByEmail(request.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            if (string.IsNullOrEmpty(user.PasswordHash))
                return Unauthorized(new { message = "Account is not configured for password login." });

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Invalid email or password." });

            if (result == PasswordVerificationResult.SuccessRehashNeeded)
            {
                user.PasswordHash = _hasher.HashPassword(user, request.Password);
                _dbManager.UpdateUser(user);
            }

            var token = GenerateToken(user);
            return Ok(new AuthResponse
            {
                Token = token,
                User = DtoMapper.ToDto(user)
            });
        }

        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // POST: api/Auth/admin-register 
        [HttpPost("admin-register")]
        [Authorize(Roles = "Admin")]
        public ActionResult AdminRegister([FromBody] AdminRegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = _dbManager.GetUserByEmail(dto.Email);
            if (existing != null)
            {
                return BadRequest(new { message = "Ez az email cím már regisztrálva van a rendszerben." });
            }

            if (dto.RoleId < 1 || dto.RoleId > 3)
            {
                return BadRequest(new { message = "Érvénytelen szerepkör azonosító!" });
            }

            var newUser = new User
            {
                Name = dto.Name.Trim(),
                Email = dto.Email.Trim().ToLower(),
                Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim(),
                Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
                DrivingLicence = string.IsNullOrWhiteSpace(dto.DrivingLicence) ? null : dto.DrivingLicence.Trim(),
                RoleId = dto.RoleId
            };

            newUser.PasswordHash = _hasher.HashPassword(newUser, dto.Password);
            _dbManager.AddUser(newUser);

            return Ok(new { message = "Az új felhasználói fiók sikeresen létrehozva." });
        }
    }
}
