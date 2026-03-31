using Berauto.Models;
using Microsoft.AspNetCore.Mvc;

namespace Berauto.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DbManager _dbManager;

        public UsersController(DbManager dbManager)
        {
            _dbManager = dbManager;
        }

        // GET: api/users/admins
        [HttpGet("admins")]
        public ActionResult<List<User>> GetAdmins()
        {
            return Ok(_dbManager.GetAdmins());
        }

        // GET: api/users/officers
        [HttpGet("officers")]
        public ActionResult<List<User>> GetOfficers()
        {
            return Ok(_dbManager.GetOfficers());
        }

        // GET: api/users/clients
        [HttpGet("clients")]
        public ActionResult<List<User>> GetClients()
        {
            return Ok(_dbManager.GetClients());
        }

        // POST: api/users
        [HttpPost]
        public ActionResult AddUser([FromBody] User user)
        {
            _dbManager.AddUser(user);
            return CreatedAtAction(nameof(GetClients), new { id = user.Id }, user);
        }
    }
}