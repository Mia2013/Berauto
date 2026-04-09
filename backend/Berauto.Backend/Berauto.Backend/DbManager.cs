using Berauto.Models;
using Microsoft.EntityFrameworkCore;

namespace Berauto;

public class DbManager
{
    // HOZZÁADÁSOK

    public void AddUser(User user)
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            db.Users.Add(user);
            db.SaveChanges();
        }
    }
    
    public void AddCar(Car car)
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            db.Cars.Add(car);
            db.SaveChanges();
        }
    }
    
    
    
    // AUTÓ LEKÉRDEZÉSEK
    
    public List<Car> GetAvailableCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Where(c => c.IsRentable == true && 
                            !db.Rentals.Any(r => r.CarId == c.Id && r.HandoverDate != null && r.ReturnDate == null))
                .ToList();
        }
    }
    
    
    
    public List<Car> GetAvailablePetrolCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Where(c => c.IsRentable == true && 
                            !db.Rentals.Any(r => r.CarId == c.Id && r.HandoverDate != null && r.ReturnDate == null && 
                            c.FuelId == 1))
                .ToList();
        }
    }
    
    public List<Car> GetAvailableDieselCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Where(c => c.IsRentable == true && 
                            !db.Rentals.Any(r => r.CarId == c.Id && r.HandoverDate != null && r.ReturnDate == null && 
                            c.FuelId == 2))
                .ToList();
        }
    }
    
    public List<Car> GetRentedCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Where(c => db.Rentals.Any(r => r.CarId == c.Id && r.HandoverDate != null && r.ReturnDate == null))
                .ToList();
        }
    }
    
    public List<Car> GetServicedCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Where(c => c.IsRentable == false || db.Services.Any(s => s.CarId == c.Id && s.ReturnDate == null))
                .ToList();
        }
    }
    
    
    
    // AKTOROK LEKÉRDEZÉSEI
    
    public List<User> GetAdmins()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Users
                .Include(c => c.Role)
                .Where(c => c.RoleId == 1)
                .ToList();
        }
    }
    
    public List<User> GetOfficers()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Users
                .Include(c => c.Role)
                .Where(c => c.RoleId == 2)
                .ToList();
        }
    }
    
    public List<User> GetClients()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Users
                .Include(c => c.Role)
                .Where(c => c.RoleId == 3)
                .ToList();
        }
    }
    
    
    // MÓDÓSÍTÁSOK
    public void UpdateUserProfile(int userId, string newAddress, string newPhone)
    {
        using var db = new CarRentalDbContext();
        var user = db.Users.Find(userId);
        if (user != null)
        {
            user.Address = newAddress;
            user.Phone = newPhone;
            db.SaveChanges();
        }
    }
    
    
    public void RequestRental(int userId, int carId)
    {
        using var db = new CarRentalDbContext();
        var rental = new Rental
        {
            UserId = userId,
            CarId = carId,
            StatusId = 1, // Requested
            RequestDate = DateTime.Now
        };
        db.Rentals.Add(rental);
        db.SaveChanges();
    }
    
    
    public void ConfirmHandover(int rentalId)
    {
        using var db = new CarRentalDbContext();
        var rental = db.Rentals.Find(rentalId);
        if (rental != null)
        {
            rental.StatusId = 3; // HandedOver
            rental.HandoverDate = DateTime.Now;
            db.SaveChanges();
        }
    }
    
    
    public void ConfirmReturn(int rentalId)
    {
        using var db = new CarRentalDbContext();
        var rental = db.Rentals.Include(r => r.Car).FirstOrDefault(r => r.Id == rentalId);
        if (rental != null)
        {
            rental.StatusId = 4; // Returned
            rental.ReturnDate = DateTime.Now;
        
            // Alap kalkuláció: napok száma * napi díj
            var days = (rental.ReturnDate.Value - rental.HandoverDate.Value).Days + 1;
            rental.TotalCost = days * rental.Car.Fee;
        
            db.SaveChanges();
        }
    }


    public void UpdateCarMileage(int carId, int newMileage)
    {
        using var db = new CarRentalDbContext();
        var car = db.Cars.Find(carId);
        if (car != null)
        {
            car.Mileage = newMileage;
            db.SaveChanges();
        }
    }
}