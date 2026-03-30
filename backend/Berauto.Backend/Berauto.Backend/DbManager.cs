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
                .Include(c => c.Status)
                .Where(c => c.StatusId == 1)
                .ToList();
        }
    }
    
    public List<Car> GetAvailableRentableCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Include(c => c.Status)
                .Where(c => c.StatusId == 1 && c.IsRentable == true)
                .ToList();
        }
    }
    
    public List<Car> GetAvailableNonrentableCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Include(c => c.Status)
                .Where(c => c.StatusId == 1 && c.IsRentable == false)
                .ToList();
        }
    }
    
    public List<Car> GetAvailablePetrolCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Include(c => c.Status)
                .Where(c => c.StatusId == 1 && c.FuelId == 1)
                .ToList();
        }
    }
    
    public List<Car> GetAvailableDieselCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Include(c => c.Status)
                .Where(c => c.StatusId == 1 && c.FuelId == 2)
                .ToList();
        }
    }
    
    public List<Car> GetRentedCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Include(c => c.Status)
                .Where(c => c.StatusId == 2)
                .ToList();
        }
    }
    
    public List<Car> GetServicedCars()
    {
        using (CarRentalDbContext db = new CarRentalDbContext())
        {
            return db.Cars
                .Include(c => c.Fuel)
                .Include(c => c.Status)
                .Where(c => c.StatusId == 3)
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
}