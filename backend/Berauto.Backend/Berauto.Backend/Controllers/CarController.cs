using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Berauto.Backend.Data;
using Berauto.Backend.Models;
using Berauto.Backend.DTO;
using Berauto.Backend.Repository;
using AutoMapper;

namespace Berauto.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CarController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET: api/Car
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarDTO>>> GetCars()
        {
            var cars = await _unitOfWork.Cars.GetAllAsync(include: new[] { "Fuel" });
            return Ok(_mapper.Map<IEnumerable<CarDTO>>(cars));
        }

        // GET: api/Car/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CarDTO>> GetCar(int id)
        {
            var car = await _unitOfWork.Cars.GetAllAsync(
                filter: c => c.Id == id, 
                include: new[] { "Fuel" }
            );

            var carEntity = car.FirstOrDefault();

            if (carEntity == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<CarDTO>(carEntity));
        }

        // PUT: api/Car/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCar(int id, CarDTO carDto)
        {
            if (id != carDto.Id)
            {
                return BadRequest();
            }

            var car = _mapper.Map<Car>(carDto);
            _unitOfWork.Cars.Update(car);

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

        // POST: api/Car
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CarDTO>> PostCar(CarDTO carDto)
        {
            var car = _mapper.Map<Car>(carDto);
        
            _unitOfWork.Cars.Add(car);
            await _unitOfWork.CompleteAsync();

            var resultDto = _mapper.Map<CarDTO>(car);

            return CreatedAtAction(nameof(GetCar), new { id = car.Id }, resultDto);
        }

        // DELETE: api/Car/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _unitOfWork.Cars.FindByIdAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            _unitOfWork.Cars.Delete(car);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
