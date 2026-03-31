using Berauto.Models;
using Microsoft.EntityFrameworkCore;

namespace Berauto;

public class DbManager
{
    private readonly CarRentalDbContext _db;

    public DbManager(CarRentalDbContext db)
    {
        _db = db;
    }

    // HOZZÁADÁSOK
    public void AddUser(User user)
    {
        _db.Users.Add(user);
        _db.SaveChanges();
    }

    public void AddCar(Car car)
    {
        _db.Cars.Add(car);
        _db.SaveChanges();
    }

    // AUTÓ LEKÉRDEZÉSEK
    public List<Car> GetAvailableCars() =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status)
            .Where(c => c.StatusId == 1).ToList();

    public List<Car> GetAvailableRentableCars() =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status)
            .Where(c => c.StatusId == 1 && c.IsRentable).ToList();

    public List<Car> GetAvailableNonrentableCars() =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status)
            .Where(c => c.StatusId == 1 && !c.IsRentable).ToList();

    public List<Car> GetAvailablePetrolCars() =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status)
            .Where(c => c.StatusId == 1 && c.FuelId == 1).ToList();

    public List<Car> GetAvailableDieselCars() =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status)
            .Where(c => c.StatusId == 1 && c.FuelId == 2).ToList();

    public List<Car> GetRentedCars() =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status)
            .Where(c => c.StatusId == 2).ToList();

    public List<Car> GetServicedCars() =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status)
            .Where(c => c.StatusId == 3).ToList();

    // AKTOROK LEKÉRDEZÉSEI
    public List<User> GetAdmins() =>
        _db.Users.Include(u => u.Role).Where(u => u.RoleId == 1).ToList();

    public List<User> GetOfficers() =>
        _db.Users.Include(u => u.Role).Where(u => u.RoleId == 2).ToList();

    public List<User> GetClients() =>
        _db.Users.Include(u => u.Role).Where(u => u.RoleId == 3).ToList();

    // BÉRLÉSEK LEKÉRDEZÉSEI
    public List<Rental> GetAllRentals() =>
        _db.Rentals
            .Include(r => r.Car)
            .Include(r => r.User)
            .Include(r => r.Status)
            .ToList();

    public List<Rental> GetRentalsByUser(int userId) =>
        _db.Rentals
            .Include(r => r.Car)
            .Include(r => r.User)
            .Include(r => r.Status)
            .Where(r => r.UserId == userId)
            .ToList();

    public void AddRental(Rental rental)
    {
        _db.Rentals.Add(rental);
        _db.SaveChanges();
    }

    public User? GetUserByEmail(string email) =>
    _db.Users
        .Include(u => u.Role)
        .FirstOrDefault(u => u.Email == email);


}