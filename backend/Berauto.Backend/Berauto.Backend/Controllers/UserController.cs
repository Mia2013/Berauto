using Berauto.Backend.Data;
using Berauto.Backend.DTO;
using Berauto.Backend.Models;
using Berauto.Backend.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Berauto.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private IUnitOfWork _unitOfWork;
        public UserController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<User>> GetMyData()
        {
            var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userid == null)
            {
                return Unauthorized();
            }
            var user = await _unitOfWork.Users.FindByIdAsync(Int32.Parse(userid));
          
            return Ok(user);
        }
        [HttpPut]
        public async Task<ActionResult>UpdateUserData(UpdateUserDto dto)
        {

            var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userid == null)
            {
                return Unauthorized();
            }
            var user = await _unitOfWork.Users.FindByIdAsync(Int32.Parse(userid));
            if(dto.Password!=null)
            {
                user.PasswordHash = PassHashing(dto, user);
            }
            if(dto.Phone!=null)
            {
                user.Phone = dto.Phone;
            }
            if(dto.Address!=null)
            {
                user.Address = dto.Address;
            }
            _unitOfWork.Users.Update(user);
            return Ok();
        }
        public String PassHashing(UpdateUserDto dto, User User)
        {

            var passwordhash = new PasswordHasher<User>();
            return passwordhash.HashPassword(User, dto.Password);

        }
    }
}
