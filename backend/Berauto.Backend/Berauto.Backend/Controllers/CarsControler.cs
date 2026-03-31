using Berauto.Backend.DTOs;
using Berauto.Models;
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

        // GET: api/cars
        [HttpGet]
        public ActionResult<List<CarDto>> GetAvailableCars()
        {
            return Ok(_dbManager.GetAvailableCars().Select(DtoMapper.ToDto));
        }

        // GET: api/cars/rentable
        [HttpGet("rentable")]
        public ActionResult<List<CarDto>> GetRentableCars()
        {
            return Ok(_dbManager.GetAvailableRentableCars().Select(DtoMapper.ToDto));
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

        // GET: api/cars/rented
        [HttpGet("rented")]
        public ActionResult<List<CarDto>> GetRentedCars()
        {
            return Ok(_dbManager.GetRentedCars().Select(DtoMapper.ToDto));
        }

        // GET: api/cars/serviced
        [HttpGet("serviced")]
        public ActionResult<List<CarDto>> GetServicedCars()
        {
            return Ok(_dbManager.GetServicedCars().Select(DtoMapper.ToDto));
        }

        // POST: api/cars
        [HttpPost]
        public ActionResult AddCar([FromBody] Car car)
        {
            _dbManager.AddCar(car);
            return CreatedAtAction(nameof(GetAvailableCars), new { id = car.Id }, car);
        }
    }
}