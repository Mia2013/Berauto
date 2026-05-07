using Berauto.Backend.DTO;
using Berauto.Backend.Models;
using Berauto.Backend.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<ActionResult> UpdateUserData(UpdateUserDto dto)
        {
            var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userid == null)
            {
                return Unauthorized();
            }

            var user = await _unitOfWork.Users.FindByIdAsync(Int32.Parse(userid));
            if (user == null)
            {
                return NotFound();
            }

            if (dto.Password != null)
            {
                user.PasswordHash = PassHashing(dto, user);
            }
            if (dto.Phone != null)
            {
                user.Phone = dto.Phone;
            }
            if (dto.Address != null)
            {
                user.Address = dto.Address;
            }

            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync(); // BUG FIX: was missing — changes were never saved to DB

            return Ok();
        }

        //change the visibility to private
        private string PassHashing(UpdateUserDto dto, User user)
        {
            var passwordhash = new PasswordHasher<User>();
            return passwordhash.HashPassword(user, dto.Password);
        }
    }
}
