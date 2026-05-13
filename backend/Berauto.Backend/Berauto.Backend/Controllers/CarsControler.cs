using Berauto.Backend.DTOs;
using Berauto.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Berauto.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly DbManager _dbManager;

        public CarsController(DbManager dbManager)
        {
            _dbManager = dbManager;
        }

        // GET: api/cars  (available cars — for the public browsing page)
        [HttpGet]
        public ActionResult<List<CarDto>> GetAvailableCars()
        {
            return Ok(_dbManager.GetAvailableCars().Select(DtoMapper.ToDto));
        }

        // GET: api/cars/{id}
        [HttpGet("{id}")]
        public ActionResult<CarDto> GetCar(int id)
        {
            var car = _dbManager.GetCarById(id);
            if (car == null) return NotFound();
            return Ok(DtoMapper.ToDto(car));
        }

        // GET: api/cars/rentable
        [HttpGet("rentable")]
        public ActionResult<List<CarDto>> GetRentableCars([FromBody] DateOnly startDate,DateOnly endDate)
        {
            return Ok(_dbManager.GetAvailableRentableCars(startDate,endDate).Select(DtoMapper.ToDto));
        }

        // GET: api/cars/nonrentable
        [HttpGet("nonrentable")]
        public ActionResult<List<CarDto>> GetNonRentableCars()
        {
            return Ok(_dbManager.GetAvailableNonrentableCars().Select(DtoMapper.ToDto));
        }

        // GET: api/cars/petrol
        [HttpGet("petrol")]
        public ActionResult<List<CarDto>> GetPetrolCars()
        {
            return Ok(_dbManager.GetAvailablePetrolCars().Select(DtoMapper.ToDto));
        }

        // GET: api/cars/diesel
        [HttpGet("diesel")]
        public ActionResult<List<CarDto>> GetDieselCars()
        {
            return Ok(_dbManager.GetAvailableDieselCars().Select(DtoMapper.ToDto));
        }

        // GET: api/cars/rented  (staff only)
        [HttpGet("rented")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<List<CarDto>> GetRentedCars()
        {
            return Ok(_dbManager.GetRentedCars().Select(DtoMapper.ToDto));
        }

        // GET: api/cars/awaiting-inspection  (staff queue of cars to inspect)
        [HttpGet("awaiting-inspection")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<List<CarDto>> GetAwaitingInspection()
        {
            return Ok(_dbManager.GetAwaitingInspectionCars().Select(DtoMapper.ToDto));
        }

        // GET: api/cars/serviced
        [HttpGet("serviced")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<List<CarDto>> GetServicedCars()
        {
            return Ok(_dbManager.GetServicedCars().Select(DtoMapper.ToDto));
        }

        // POST: api/cars  (staff adds a new car)
        [Authorize(Roles = "Admin,Officer")]
        [HttpPost]
        public ActionResult<CarDto> AddCar([FromBody] Car car)
        {
            _dbManager.AddCar(car);
            var reloaded = _dbManager.GetCarById(car.Id) ?? car;
            return CreatedAtAction(nameof(GetCar), new { id = reloaded.Id }, DtoMapper.ToDto(reloaded));
        }

        // POST: api/cars/{id}/maintenance  (admin pulls a car off the road)
        [Authorize(Roles = "Admin,Officer")]
        [HttpPost("{id}/maintenance")]
        public ActionResult<CarDto> SetMaintenance(int id)
        {
            try
            {
                var car = _dbManager.SetCarMaintenance(id);
                return Ok(DtoMapper.ToDto(_dbManager.GetCarById(car.Id)!));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/cars/{id}/activate  (admin returns a car to the Available pool)
        [Authorize(Roles = "Admin,Officer")]
        [HttpPost("{id}/activate")]
        public ActionResult<CarDto> Activate(int id)
        {
            try
            {
                var car = _dbManager.ActivateCar(id);
                return Ok(DtoMapper.ToDto(_dbManager.GetCarById(car.Id)!));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
