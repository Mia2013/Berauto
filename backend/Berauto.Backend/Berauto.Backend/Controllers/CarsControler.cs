using Berauto.Backend.DTOs;
using Berauto.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public ActionResult<CarDto> UpdateCar(int id, [FromBody] UpdateCarDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var updates = new Car
            {
                Id = id,
                RegNum = dto.RegNum,
                Brand = dto.Brand,
                Model = dto.Model,
                Mileage = dto.Mileage,
                Fee = dto.Fee,
                FuelId = dto.FuelId,
                IsRentable = dto.IsRentable,
            };

            try
            {
                var updated = _dbManager.UpdateCar(updates);
                return Ok(DtoMapper.ToDto(updated));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet]
        public ActionResult<List<CarDto>> GetAvailableCars()
        {
            return Ok(_dbManager.GetAvailableCars().Select(DtoMapper.ToDto));
        }

        [HttpGet("{id}")]
        public ActionResult<CarDto> GetCar(int id)
        {
            var car = _dbManager.GetCarById(id);
            if (car == null) return NotFound();
            return Ok(DtoMapper.ToDto(car));
        }

        // GET: api/cars/rentable?startDate=2026-05-13&endDate=2026-05-20
        [HttpGet("rentable")]
        public ActionResult<List<CarDto>> GetRentableCars(
            [FromQuery] DateOnly? startDate,
            [FromQuery] DateOnly? endDate)
        {
            if (startDate.HasValue != endDate.HasValue)
                return BadRequest(new { message = "startDate and endDate must both be provided or both omitted." });

            try
            {
                return Ok(_dbManager.GetAvailableRentableCars(startDate, endDate).Select(DtoMapper.ToDto));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<List<CarDto>> GetRentedCars()
        {
            return Ok(_dbManager.GetRentedCars().Select(DtoMapper.ToDto));
        }

        // GET: api/cars/awaiting-inspection 
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

        // POST: api/cars  
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public ActionResult<CarDto> AddCar([FromBody] CreateCarRequest request)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var car = new Car
            {
                RegNum = request.RegNum,
                Brand = request.Brand,
                Model = request.Model,
                Mileage = request.Mileage,
                Fee = request.Fee,
                FuelId = request.FuelId,
                StatusId = request.StatusId == 0 ? CarStatusId.Available : request.StatusId,
                IsRentable = request.IsRentable,
                ImgUrl = request.ImgUrl
            };

            try
            {
                _dbManager.AddCar(car);
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { message = ex.InnerException?.Message ?? ex.Message });
            }

            var reloaded = _dbManager.GetCarById(car.Id) ?? car;
            return CreatedAtAction(nameof(GetCar), new { id = reloaded.Id }, DtoMapper.ToDto(reloaded));
        }

        // POST: api/cars/{id}/maintenance 
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

        // POST: api/cars/{id}/activate 
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


    [HttpGet("validate-regnum/{regNum}")]
        public ActionResult<bool> ValidateRegNum(string regNum)
        {
            bool exists = _dbManager.CarExistsWithRegNum(regNum);

            if (exists)
            {
                 return BadRequest(new { message = "Ez a rendszám már létezik a rendszerben!" });
            }

            return Ok(new { available = true });
        }

        [Authorize(Roles = "Admin,Officer")]
        [HttpDelete("{id:int}")]
        public IActionResult DeleteCar(int id)
        {
            try
            {
                _dbManager.DeleteCar(id);
                return Ok(new { message = "Autó sikeresen törölve." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { message = "Adatbázis hiba történt a törlés során: " + (ex.InnerException?.Message ?? ex.Message) });
            }
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin,Officer")]
        public ActionResult<List<CarDto>> GetAllCarsForAdmin()
        {
            return Ok(_dbManager.GetAllCarsForAdmin().Select(DtoMapper.ToDto));
        }
    }
}