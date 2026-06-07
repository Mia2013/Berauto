using Berauto.Backend.DTOs;
using Berauto.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Berauto.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RentalsController : ControllerBase
    {
        private readonly DbManager _dbManager;

        public RentalsController(DbManager dbManager)
        {
            _dbManager = dbManager;
        }

        //Helpers
        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private bool IsStaff =>
            User.IsInRole(RoleName.Admin) || User.IsInRole(RoleName.Officer);

        private bool CanAccessRental(Rental rental) =>
            IsStaff || rental.UserId == CurrentUserId;

        //Queries

        // GET: api/rentals  (admin/officer: all rentals)
        [HttpGet]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<List<RentalDto>> GetAllRentals()
        {
            return Ok(_dbManager.GetAllRentals().Select(DtoMapper.ToDto));
        }

        // GET: api/rentals/mine  (current user's rentals)
        [HttpGet("mine")]
        public ActionResult<List<RentalDto>> GetMyRentals()
        {
            return Ok(_dbManager.GetRentalsByUser(CurrentUserId).Select(DtoMapper.ToDto));
        }

        // GET: api/rentals/user/{userId}  (staff only)
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<List<RentalDto>> GetRentalsByUser(int userId)
        {
            return Ok(_dbManager.GetRentalsByUser(userId).Select(DtoMapper.ToDto));
        }

        // GET: api/rentals/{id}
        [HttpGet("{id}")]
        public ActionResult<RentalDto> GetRental(int id)
        {
            var rental = _dbManager.GetRentalById(id);
            if (rental == null) return NotFound();
            if (!CanAccessRental(rental)) return Forbid();
            return Ok(DtoMapper.ToDto(rental));
        }

        //State transitions

        // POST: api/rentals  (reserve a car; auto-confirms)
        [HttpPost]
        public ActionResult<RentalDto> CreateRental([FromBody] CreateRentalRequest request)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            try
            {
                var rental = _dbManager.ReserveCar(
                    request.CarId,
                    CurrentUserId,
                    request.PlannedStart,
                    request.PlannedEnd);

                return CreatedAtAction(nameof(GetRental), new { id = rental.Id }, DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/rentals/{id}/handover  (staff hands car over to customer)
        [HttpPost("{id}/handover")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<RentalDto> Handover(int id)
        {
            try
            {
                var rental = _dbManager.HandoverRental(id);
                return Ok(DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/rentals/{id}/return  (user or staff marks rental returned)
        [HttpPost("{id}/return")]
        public ActionResult<RentalDto> Return(int id)
        {
            var existing = _dbManager.GetRentalById(id);
            if (existing == null) return NotFound();
            if (!CanAccessRental(existing)) return Forbid();

            try
            {
                var rental = _dbManager.ReturnRental(id);
                return Ok(DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/rentals/{id}/inspect  (staff records inspection results)
        [HttpPost("{id}/inspect")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<RentalDto> Inspect(int id, [FromBody] InspectRequest request)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            try
            {
                var rental = _dbManager.InspectRental(
                    id, request.ReturnMileage, request.Condition, request.Accept);
                return Ok(DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/rentals/{id}/cancel  (owner or staff)
        [HttpPost("{id}/cancel")]
        public ActionResult<RentalDto> Cancel(int id)
        {
            var existing = _dbManager.GetRentalById(id);
            if (existing == null) return NotFound();
            if (!CanAccessRental(existing)) return Forbid();

            try
            {
                var rental = _dbManager.CancelRental(id);
                return Ok(DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/rentals/{id}  (admin direct edit)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult<RentalDto> EditRental(int id, [FromBody] EditRentalRequest request)
        {
            if (_dbManager.GetRentalById(id) == null) return NotFound();

            try
            {
                var rental = _dbManager.EditRental(id, request);
                return Ok(DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/rentals/guest  (no auth — anonymous booking)
        [HttpPost("guest")]
        [AllowAnonymous]
        public ActionResult<RentalDto> ReserveAsGuest([FromBody] GuestRentalRequest req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            try
            {
                var rental = _dbManager.ReserveCarAsGuest(
                    req.CarId,
                    req.PlannedStart,
                    req.PlannedEnd,
                    req.Name,
                    req.Email,
                    req.Phone,
                    req.Address,
                    req.DrivingLicence);

                return Ok(DtoMapper.ToDto(rental));   // adjust if your mapper has a different name
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
