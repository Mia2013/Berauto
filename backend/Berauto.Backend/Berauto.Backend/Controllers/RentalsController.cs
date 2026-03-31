using Berauto.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Berauto.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentalsController : ControllerBase
    {
        private readonly DbManager _dbManager;

        public RentalsController(DbManager dbManager)
        {
            _dbManager = dbManager;
        }

        // GET: api/rentals
        [Authorize]
        [HttpGet]
        public ActionResult<List<Rental>> GetAllRentals()
        {
            return Ok(_dbManager.GetAllRentals());
        }

        // GET: api/rentals/user/{userId}
        [HttpGet("user/{userId}")]
        public ActionResult<List<Rental>> GetRentalsByUser(int userId)
        {
            return Ok(_dbManager.GetRentalsByUser(userId));
        }

        // POST: api/rentals
        [Authorize]
        [HttpPost]
        public ActionResult CreateRental([FromBody] Rental rental)
        {
            _dbManager.AddRental(rental);
            return CreatedAtAction(nameof(GetAllRentals), new { id = rental.Id }, rental);
        }
    }
}