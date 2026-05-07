using Berauto.Backend.DTO;
using Berauto.Backend.Models;
using Berauto.Backend.Repository;
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
    public class AuthController : Controller
    {
        private IUnitOfWork _unitofwork;

        public AuthController(IUnitOfWork unitOfWork)
        {
            _unitofwork = unitOfWork;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> Regist(RegisterDto dto)
        {
            var users = await _unitofwork.Users.GetAllAsync(u => u.Email == dto.Email);
            var existsUser = users.FirstOrDefault();

            // BUG FIX 1: was == null (backwards), now correctly blocks duplicate emails
            if (existsUser != null)
            {
                return BadRequest("Email már létezik");
            }

            var user = new User
            {
                Email  = dto.Email,
                Name   = dto.Name,
                RoleId = 3  // BUG FIX 2: assign Client role by ID instead of creating a new Role object
            };
            user.PasswordHash = PassHashing(dto, user);

            _unitofwork.Users.Add(user);
            await _unitofwork.CompleteAsync(); // BUG FIX 3: was missing — user was never saved to DB

            return Ok("Sikeres regisztráció!");
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto dto)
        {
            var users = await _unitofwork.Users.GetAllAsync(u => u.Email == dto.Email);
            var user = users.FirstOrDefault();

            // BUG FIX 4: was != null (backwards), now correctly blocks unknown users
            if (user == null)
            {
                return BadRequest("Nincs ilyen felhasználó!");
            }
            

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Érvénytelen jelszó!");
            }

            return Ok(TokenGenerate(user));
        }

        //change this to private
        private string PassHashing(RegisterDto dto, User user)
        {
            var passwordhash = new PasswordHasher<User>();
            return passwordhash.HashPassword(user, dto.Password);
        }

        //another public->private visibility change
        private AuthResponseDto TokenGenerate(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                // BUG FIX 5: was Claim("id", ...) but UserController reads ClaimTypes.NameIdentifier — they must match
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("EzEgyNagyonHosszúEsBiztonságosTitkosKulcs123"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer:            "MyApi",
                audience:          "MyApiClient",
                claims:            claims,
                expires:           DateTime.Now.AddMinutes(60),
                signingCredentials: creds
            );

            return new AuthResponseDto
            {
                Token   = new JwtSecurityTokenHandler().WriteToken(token),
                Expires = token.ValidTo,
                Name    = user.Name,
                Role    = user.Role?.Name ?? ""
            };
        }
    }
}
