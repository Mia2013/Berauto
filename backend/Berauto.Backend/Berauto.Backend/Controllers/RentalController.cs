using AutoMapper;
using Berauto.Backend.DTO;
using Berauto.Backend.Models;
using Berauto.Backend.Repository;
using Microsoft.AspNetCore.Mvc;

namespace Berauto.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentalController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RentalController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET: api/Rental
        // Returns all rentals with related Car, User and Status data
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RentalDTO>>> GetRentals()
        {
            var rentals = await _unitOfWork.Rentals.GetAllAsync(
                include: new[] { "Car", "User", "Status" }
            );
            return Ok(_mapper.Map<IEnumerable<RentalDTO>>(rentals));
        }

        // GET: api/Rental/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RentalDTO>> GetRental(int id)
        {
            var rentals = await _unitOfWork.Rentals.GetAllAsync(
                filter: r => r.Id == id,
                include: new[] { "Car", "User", "Status" }
            );

            var rental = rentals.FirstOrDefault();
            if (rental == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<RentalDTO>(rental));
        }

        // POST: api/Rental
        // Client requests a rental — only CarId and UserId are needed in the body
        [HttpPost]
        public async Task<ActionResult<RentalDTO>> PostRental(RentalDTO rentalDto)
        {
            var rental = new Rental
            {
                CarId       = rentalDto.CarId,
                UserId      = rentalDto.UserId,
                StatusId    = 1,            // 1 = Requested
                RequestDate = DateTime.Now
            };

            _unitOfWork.Rentals.Add(rental);
            await _unitOfWork.CompleteAsync();

            // Reload with navigation properties so the DTO is fully populated
            var created = await _unitOfWork.Rentals.GetAllAsync(
                filter: r => r.Id == rental.Id,
                include: new[] { "Car", "User", "Status" }
            );

            return CreatedAtAction(nameof(GetRental), new { id = rental.Id },
                _mapper.Map<RentalDTO>(created.FirstOrDefault()));
        }

        // PUT: api/Rental/handover/5
        // Officer confirms the car has been handed over to the client
        [HttpPut("handover/{id}")]
        public async Task<IActionResult> ConfirmHandover(int id)
        {
            var rental = await _unitOfWork.Rentals.FindByIdAsync(id);
            if (rental == null)
            {
                return NotFound();
            }

            rental.StatusId    = 3;             // 3 = HandedOver
            rental.HandoverDate = DateTime.Now;

            _unitOfWork.Rentals.Update(rental);

            try
            {
                await _unitOfWork.CompleteAsync();
            }
            catch (Exception)
            {
                return StatusCode(500, "Hiba történt a mentés során.");
            }

            return NoContent();
        }

        // PUT: api/Rental/return/5
        // Officer confirms the car has been returned — also calculates TotalCost
        [HttpPut("return/{id}")]
        public async Task<IActionResult> ConfirmReturn(int id)
        {
            var rentals = await _unitOfWork.Rentals.GetAllAsync(
                filter: r => r.Id == id,
                include: new[] { "Car" }
            );

            var rental = rentals.FirstOrDefault();
            if (rental == null)
            {
                return NotFound();
            }

            if (rental.HandoverDate == null)
            {
                return BadRequest("A visszavétel előtt az átadást rögzíteni kell.");
            }

            rental.StatusId  = 4;               // 4 = Returned
            rental.ReturnDate = DateTime.Now;

            // Cost = number of days (minimum 1) × daily fee
            var days = (rental.ReturnDate.Value - rental.HandoverDate.Value).Days + 1;
            rental.TotalCost = days * rental.Car!.Fee;

            _unitOfWork.Rentals.Update(rental);

            try
            {
                await _unitOfWork.CompleteAsync();
            }
            catch (Exception)
            {
                return StatusCode(500, "Hiba történt a mentés során.");
            }

            return NoContent();
        }

        // DELETE: api/Rental/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRental(int id)
        {
            var rental = await _unitOfWork.Rentals.FindByIdAsync(id);
            if (rental == null)
            {
                return NotFound();
            }

            _unitOfWork.Rentals.Delete(rental);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
