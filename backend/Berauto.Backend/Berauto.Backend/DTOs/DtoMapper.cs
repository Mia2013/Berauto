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
            CarRegNum = rental.Car.RegNum,
            CarBrand = rental.Car.Brand,
            CarModel = rental.Car.Model,
            UserName = rental.User.Name,
            UserEmail = rental.User.Email,
            Status = rental.Status.StatusName,
            RequestDate = rental.RequestDate,
            HandoverDate = rental.HandoverDate,
            ReturnDate = rental.ReturnDate,
            TotalCost = rental.TotalCost
        };
    }
}