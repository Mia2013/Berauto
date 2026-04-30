using Berauto.Models;
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

        public AuthController(IConfiguration config, DbManager dbManager)
        {
            _config = config;
            _dbManager = dbManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult Login([FromBody] LoginRequest request)
        {
            // Find user by email (simple check for now, no password yet)
            var user = _dbManager.GetUserByEmail(request.Email);
            if (user == null)
                return Unauthorized("Invalid email.");
            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            
            if(result==PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid Password!");
            }

            var token = GenerateToken(user);
            return Ok(new { token });
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public ActionResult Regist([FromBody] RegisterDto dto)
        {
            var user = _dbManager.GetUserByEmail(dto.Email);
            if(user!=null)
            {
                return BadRequest();
            }
            User registuser = new User();

            registuser.Email = dto.Email;
            registuser.Username = dto.Username;
            registuser.Phone = dto.Phonenumber;
            registuser.PasswordHash = PasswordHasher(registuser, dto);
            _dbManager.AddUser(registuser);
            return Ok();   
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
        public String PasswordHasher(User user, RegisterDto dto)
        {
            var hasher = new PasswordHasher<User>();
            string pass = hasher.HashPassword(user, dto.Password);
            return pass;
        }
    }
 

    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
    public class RegisterDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Phonenumber { get; set; } = null!;
        

    }
}