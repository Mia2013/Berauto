using Berauto.Backend.DTOs;
using Berauto.Backend.Models;
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

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private bool IsStaff =>
            User.IsInRole(RoleName.Admin) || User.IsInRole(RoleName.Officer);

        private bool CanAccessRental(Rental rental) =>
            IsStaff || rental.UserId == CurrentUserId;


        // GET: api/rentals 
        [HttpGet]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<List<RentalDto>> GetAllRentals()
        {
            return Ok(_dbManager.GetAllRentals().Select(DtoMapper.ToDto));
        }

        // GET: api/rentals/mine 
        [HttpGet("mine")]
        public ActionResult<List<RentalDto>> GetMyRentals()
        {
            return Ok(_dbManager.GetRentalsByUser(CurrentUserId).Select(DtoMapper.ToDto));
        }

        // GET: api/rentals/user/{userId} 
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<List<RentalDto>> GetRentalsByUser(int userId)
        {
            return Ok(_dbManager.GetRentalsByUser(userId).Select(DtoMapper.ToDto));
        }

        // GET: api/rentals/{id}
        [HttpGet("{rentalId}")]
        public ActionResult<RentalDto> GetRental(int rentalId)
        {
            var rental = _dbManager.GetRentalById(rentalId);
            if (rental == null) return NotFound();
            if (!CanAccessRental(rental)) return Forbid();
            return Ok(DtoMapper.ToDto(rental));
        }


        // POST: api/rentals 
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

                return CreatedAtAction(nameof(GetRental), new { rentalId = rental.Id }, DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/rentals/{id}/handover 
        [HttpPost("{rentalId}/handover")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<RentalDto> Handover(int rentalId)
        {
            try
            {
                var rental = _dbManager.HandoverRental(rentalId);
                return Ok(DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/rentals/{id}/return 
        [HttpPost("{rentalId}/return")]
        public ActionResult<RentalDto> Return(int rentalId)
        {
            var existing = _dbManager.GetRentalById(rentalId);
            if (existing == null) return NotFound();
            if (!CanAccessRental(existing)) return Forbid();

            try
            {
                var rental = _dbManager.ReturnRental(rentalId);
                return Ok(DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/rentals/{id}/inspect 
        [HttpPost("{rentalId}/inspect")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<RentalDto> Inspect(int rentalId, [FromBody] InspectRequest request)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            try
            {
                var rental = _dbManager.InspectRental(
                    rentalId, request.ReturnMileage, request.Condition, request.Accept);
                return Ok(DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/rentals/{rentalId}/cancel  
        [HttpPost("{rentalId}/cancel")]
        public ActionResult<RentalDto> Cancel(int rentalId)
        {
            var existing = _dbManager.GetRentalById(rentalId);
            if (existing == null) return NotFound();
            if (!CanAccessRental(existing)) return Forbid();

            try
            {
                var rental = _dbManager.CancelRental(rentalId);
                return Ok(DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/rentals/{rentalId} 
        [HttpPut("{rentalId}")]
        [Authorize(Roles = "Admin")]
        public ActionResult<RentalDto> EditRental(int rentalId, [FromBody] EditRentalRequest request)
        {
            if (_dbManager.GetRentalById(rentalId) == null) return NotFound();

            try
            {
                var rental = _dbManager.EditRental(rentalId, request);
                return Ok(DtoMapper.ToDto(rental));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/rentals/guest 
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

                return Ok(DtoMapper.ToDto(rental));   
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
