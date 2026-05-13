using Berauto.Models;

namespace Berauto.Backend.DTOs
{
    public static class DtoMapper
    {
        public static CarDto ToDto(Car car) => new CarDto
        {
            Id = car.Id,
            RegNum = car.RegNum,
            Brand = car.Brand,
            Model = car.Model,
            Mileage = car.Mileage,
            IsRentable = car.IsRentable,
            Fee = car.Fee,
            Fuel = car.Fuel.Name,
            Status = car.Status.Name
        };

        public static UserDto ToDto(User user) => new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            DrivingLicence = user.DrivingLicence,
            Role = user.Role.Name
        };

        public static RentalDto ToDto(Rental rental) => new RentalDto
        {
            Id = rental.Id,
            CarId = rental.CarId,
            CarRegNum = rental.Car.RegNum,
            CarBrand = rental.Car.Brand,
            CarModel = rental.Car.Model,
            UserId = rental.UserId,
            UserName = rental.User.Name,
            UserEmail = rental.User.Email,
            StatusId = rental.StatusId,
            Status = rental.Status.StatusName,
            RequestDate = rental.RequestDate,
            PlannedStart = rental.PlannedStart,
            PlannedEnd = rental.PlannedEnd,
            HandoverDate = rental.HandoverDate,
            ReturnDate = rental.ReturnDate,
            TotalCost = rental.TotalCost,
            ReturnMileage = rental.ReturnMileage,
            Condition = rental.Condition
        };
    }
}