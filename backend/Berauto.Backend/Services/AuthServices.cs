using Berauto.Backend.DTOs;
using Berauto.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class AuthServices
    {

        private readonly CarRentalDbContext _context;
        public AuthServices(CarRentalDbContext _context)
        {
            this._context = _context;
        }

        public async Task<LoginResult> Regist(RegisterDto dto, Func<RegisterDto, User> createUser)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user != null)
            {
                return (new LoginResult
                {
                    status = Status.AlreadyExists
                });
            }
            var newuser = createUser(dto);
            newuser.PasswordHash = PasswordHashing(dto, newuser);
            await _context.Users.AddAsync(newuser);
            await _context.SaveChangesAsync();
            return (new LoginResult
            {
                status = Status.Success
            });

        }
        public async Task<LoginResult> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                return (new LoginResult
                {
                    status = Status.NotExists
                });
            }
            var passworhash = new PasswordHasher<User>();
            var result = passworhash.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return (new LoginResult
                {
                    status = Status.InvalidPassword
                });
            }
            var token = GenerateToken(user);
            return (new LoginResult
            {
                status = Status.Success,
                Response = new LoginResponse
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Expires = token.ValidTo,
                    Name = user.Name,
                    Role = user.Role.ToString()
                }

            });

        }
        public String PasswordHashing(RegisterDto dto, User user)
        {
            var passwordhash = new PasswordHasher<User>();
            return passwordhash.HashPassword(user, dto.Password);
        }
        public JwtSecurityToken GenerateToken(User user)
        {
            var claims = new[]
           {
                new Claim(JwtRegisteredClaimNames.Sub,user.Email),
                new Claim("Id",user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
            };
            var Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("EZegyNagyonHosszúésTITKOSkulcs"));
            var creds = new SigningCredentials(Key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: "MyApi",
                audience: "MyApiClient",
                claims: claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: creds);
            return token;
        }

    }
}

