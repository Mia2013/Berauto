using Berauto.Backend.DTOs;
using Berauto.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Berauto.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly DbManager _dbManager;

        public UsersController(DbManager dbManager)
        {
            _dbManager = dbManager;
        }

        // GET: api/users/admins
        [HttpGet("admins")]
        [Authorize(Roles = "Admin")]
        public ActionResult<List<UserDto>> GetAdmins()
        {
            return Ok(_dbManager.GetAdmins().Select(DtoMapper.ToDto));
        }

        // GET: api/users/officers
        [HttpGet("officers")]
        [Authorize(Roles = "Admin")]
        public ActionResult<List<UserDto>> GetOfficers()
        {
            return Ok(_dbManager.GetOfficers().Select(DtoMapper.ToDto));
        }

        // GET: api/users/clients
        [HttpGet("clients")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<List<UserDto>> GetClients()
        {
            return Ok(_dbManager.GetClients().Select(DtoMapper.ToDto));
        }
    }
}
