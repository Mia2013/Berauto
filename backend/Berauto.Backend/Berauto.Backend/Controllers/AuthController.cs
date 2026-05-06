using Berauto.Backend.DTO;
using Berauto.Backend.Models;
using Berauto.Backend.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

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
        public async Task<ActionResult>Regist(RegisterDto dto)
        {
            var users = await _unitofwork.Users.GetAllAsync(u => u.Email == dto.Email);
            var existsuser = users.FirstOrDefault();
            if(existsuser==null)
            {
                return BadRequest("Email már létezik");
            }
            var user = new User();

            user.Email = dto.Email;
            user.Name = dto.Name;
            user.PasswordHash = PassHashing(dto, user);
            user.Role = new Role { Name = "User" };
            _unitofwork.Users.Add(user);
            return Ok("Sikeres regisztráció!");
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult>Login(LoginDto dto)
        {
            var users = await _unitofwork.Users.GetAllAsync(u => u.Email == dto.Email);
            var user = users.FirstOrDefault();
             if(user!=null)
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

        public String PassHashing(RegisterDto dto, User User)
        {

            var passwordhash = new PasswordHasher<User>();
            return passwordhash.HashPassword(User, dto.Password);

        }
        public AuthResponseDto TokenGenerate(User user)
        {
            var claims = new[]
          {
                 new Claim(JwtRegisteredClaimNames.Sub,user.Email),
                 new Claim("id",user.Id.ToString()),
                 new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
             };
            var Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("EzEgyNagyonHosszúEsBiztonságosTitkosKulcs123"));
            var creds = new SigningCredentials(Key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: "MyApi",
                audience: "MyApiClient",
                claims: claims,
                expires: DateTime.Now.AddMinutes(5),
                 signingCredentials: creds
                );
            return new AuthResponseDto
            {

                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expires = token.ValidTo,
                Name = user.Name,
                Role = user.Role.Name
            };
             
        }
    }

    }
