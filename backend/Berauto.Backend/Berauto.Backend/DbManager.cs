using Berauto.Backend.DTOs;
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

    // ─── USERS ──────────────────────────────────────────────────────────
    public void AddUser(User user)
    {
        _db.Users.Add(user);
        _db.SaveChanges();
    }

    public void UpdateUser(User user)
    {
        _db.Users.Update(user);
        _db.SaveChanges();
    }

    public User? GetUserById(int id) =>
        _db.Users.Include(u => u.Role).FirstOrDefault(u => u.Id == id);

    public User? GetUserByEmail(string email) =>
        _db.Users.Include(u => u.Role).FirstOrDefault(u => u.Email == email);

    public List<User> GetAdmins() =>
        _db.Users.Include(u => u.Role).Where(u => u.RoleId == RoleId.Admin).ToList();

    public List<User> GetOfficers() =>
        _db.Users.Include(u => u.Role).Where(u => u.RoleId == RoleId.Officer).ToList();

    public List<User> GetClients() =>
        _db.Users.Include(u => u.Role).Where(u => u.RoleId == RoleId.Client).ToList();

    // ─── CARS ───────────────────────────────────────────────────────────
    public void AddCar(Car car)
    {
        _db.Cars.Add(car);
        _db.SaveChanges();
    }

    public Car? GetCarById(int id) =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status).FirstOrDefault(c => c.Id == id);

    private IQueryable<Car> CarsWithIncludes() =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status);

    public List<Car> GetAvailableCars() =>
        CarsWithIncludes().Where(c => c.StatusId == CarStatusId.Available).ToList();

    /// <summary>
    /// Cars that are rentable and free for booking.
    /// - If startDate/endDate are omitted, returns cars whose current status is Available.
    /// - If both dates are provided, returns cars that have no Confirmed/Active rental
    ///   overlapping the requested window, regardless of their current status (so a car
    ///   that's reserved for next week is still listed for a request three weeks out).
    ///   Cars currently in Maintenance or AwaitingInspection are always excluded.
    /// </summary>
    public List<Car> GetAvailableRentableCars(DateOnly? startDate = null, DateOnly? endDate = null)
    {
        var query = CarsWithIncludes().Where(c => c.IsRentable);

        if (startDate.HasValue && endDate.HasValue)
        {
            if (endDate.Value <= startDate.Value)
                throw new InvalidOperationException("endDate must be after startDate.");

            var start = startDate.Value.ToDateTime(TimeOnly.MinValue);
            var end = endDate.Value.ToDateTime(TimeOnly.MaxValue);

            query = query.Where(c =>
                c.StatusId != CarStatusId.Maintenance
                && c.StatusId != CarStatusId.AwaitingInspection
                && !c.Rentals.Any(r =>
                    (r.StatusId == RentalStatusId.Confirmed || r.StatusId == RentalStatusId.Active)
                    && r.PlannedStart < end
                    && r.PlannedEnd > start));
        }
        else
        {
            query = query.Where(c => c.StatusId == CarStatusId.Available);
        }

        return query.ToList();
    }

    public List<Car> GetAvailableNonrentableCars() =>
        CarsWithIncludes()
            .Where(c => c.StatusId == CarStatusId.Available && !c.IsRentable)
            .ToList();

    public List<Car> GetAvailablePetrolCars() =>
        CarsWithIncludes()
            .Where(c => c.StatusId == CarStatusId.Available && c.FuelId == 1)
            .ToList();

    public List<Car> GetAvailableDieselCars() =>
        CarsWithIncludes()
            .Where(c => c.StatusId == CarStatusId.Available && c.FuelId == 2)
            .ToList();

    public List<Car> GetRentedCars() =>
        CarsWithIncludes().Where(c => c.StatusId == CarStatusId.Rented).ToList();

    public List<Car> GetAwaitingInspectionCars() =>
        CarsWithIncludes().Where(c => c.StatusId == CarStatusId.AwaitingInspection).ToList();

    public List<Car> GetServicedCars() =>
        CarsWithIncludes().Where(c => c.StatusId == CarStatusId.Maintenance).ToList();

    /// <summary>Admin moves a car out of circulation for service.</summary>
    public Car SetCarMaintenance(int carId)
    {
        var car = _db.Cars.FirstOrDefault(c => c.Id == carId)
            ?? throw new InvalidOperationException($"Car {carId} not found.");

        if (car.StatusId == CarStatusId.Rented || car.StatusId == CarStatusId.Reserved)
            throw new InvalidOperationException(
                "Car is currently rented or reserved; cancel/return active rental first.");

        car.StatusId = CarStatusId.Maintenance;
        _db.SaveChanges();
        return car;
    }

    /// <summary>Admin puts a car back into the Available pool (from Maintenance or AwaitingInspection).</summary>
    public Car ActivateCar(int carId)
    {
        var car = _db.Cars.FirstOrDefault(c => c.Id == carId)
            ?? throw new InvalidOperationException($"Car {carId} not found.");

        car.StatusId = CarStatusId.Available;
        _db.SaveChanges();
        return car;
    }

    // ─── RENTALS ────────────────────────────────────────────────────────
    private IQueryable<Rental> RentalsWithIncludes() =>
        _db.Rentals
            .Include(r => r.Car)
            .Include(r => r.User)
            .Include(r => r.Status);

    public List<Rental> GetAllRentals() => RentalsWithIncludes().ToList();

    public List<Rental> GetRentalsByUser(int userId) =>
        RentalsWithIncludes().Where(r => r.UserId == userId).ToList();

    public Rental? GetRentalById(int id) =>
        RentalsWithIncludes().FirstOrDefault(r => r.Id == id);

    /// <summary>
    /// User reserves an Available car. Auto-confirms (rental.Status = Confirmed),
    /// car transitions to Reserved. Computes TotalCost from car.Fee × days.
    /// </summary>
    public Rental ReserveCar(int carId, int userId, DateTime plannedStart, DateTime plannedEnd)
    {
        if (plannedEnd <= plannedStart)
            throw new InvalidOperationException("PlannedEnd must be after PlannedStart.");

        var car = _db.Cars.FirstOrDefault(c => c.Id == carId)
            ?? throw new InvalidOperationException($"Car {carId} not found.");

        if (car.StatusId != CarStatusId.Available)
            throw new InvalidOperationException("Car is not available for reservation.");
        if (!car.IsRentable)
            throw new InvalidOperationException("Car is not rentable.");

        var days = Math.Max(1, (int)Math.Ceiling((plannedEnd - plannedStart).TotalDays));
        var totalCost = days * car.Fee;

        var rental = new Rental
        {
            CarId = carId,
            UserId = userId,
            StatusId = RentalStatusId.Confirmed,
            PlannedStart = plannedStart,
            PlannedEnd = plannedEnd,
            TotalCost = totalCost
            // RequestDate is set by the DB default (getdate())
        };

        car.StatusId = CarStatusId.Reserved;

        _db.Rentals.Add(rental);
        _db.SaveChanges();

        // Reload with includes for response mapping
        return GetRentalById(rental.Id)!;
    }

    /// <summary>Admin/Officer marks a Confirmed rental as handed over to the user.</summary>
    public Rental HandoverRental(int rentalId)
    {
        var rental = _db.Rentals.Include(r => r.Car).FirstOrDefault(r => r.Id == rentalId)
            ?? throw new InvalidOperationException($"Rental {rentalId} not found.");

        if (rental.StatusId != RentalStatusId.Confirmed)
            throw new InvalidOperationException(
                $"Cannot hand over a rental in status {rental.StatusId}. Expected Confirmed.");

        rental.StatusId = RentalStatusId.Active;
        rental.HandoverDate = DateTime.UtcNow;
        rental.Car.StatusId = CarStatusId.Rented;

        _db.SaveChanges();
        return GetRentalById(rental.Id)!;
    }

    /// <summary>User (or admin) marks a rental returned. Car goes to AwaitingInspection.</summary>
    public Rental ReturnRental(int rentalId)
    {
        var rental = _db.Rentals.Include(r => r.Car).FirstOrDefault(r => r.Id == rentalId)
            ?? throw new InvalidOperationException($"Rental {rentalId} not found.");

        if (rental.StatusId != RentalStatusId.Active)
            throw new InvalidOperationException(
                $"Cannot return a rental in status {rental.StatusId}. Expected Active.");

        rental.StatusId = RentalStatusId.Returned;
        rental.ReturnDate = DateTime.UtcNow;
        rental.Car.StatusId = CarStatusId.AwaitingInspection;

        _db.SaveChanges();
        return GetRentalById(rental.Id)!;
    }

    /// <summary>
    /// Admin inspects a returned car. Updates Car.Mileage and Rental.Condition,
    /// then either puts car back to Available (accept=true) or Maintenance (accept=false).
    /// </summary>
    public Rental InspectRental(int rentalId, int? returnMileage, string? condition, bool accept)
    {
        var rental = _db.Rentals.Include(r => r.Car).FirstOrDefault(r => r.Id == rentalId)
            ?? throw new InvalidOperationException($"Rental {rentalId} not found.");

        if (rental.StatusId != RentalStatusId.Returned)
            throw new InvalidOperationException(
                $"Cannot inspect a rental in status {rental.StatusId}. Expected Returned.");

        if (returnMileage.HasValue)
        {
            if (returnMileage.Value < rental.Car.Mileage)
                throw new InvalidOperationException(
                    "Return mileage cannot be lower than the car's current mileage.");
            rental.ReturnMileage = returnMileage.Value;
            rental.Car.Mileage = returnMileage.Value;
        }

        rental.Condition = condition;
        rental.StatusId = RentalStatusId.Completed;
        rental.Car.StatusId = accept ? CarStatusId.Available : CarStatusId.Maintenance;

        _db.SaveChanges();
        return GetRentalById(rental.Id)!;
    }

    /// <summary>Cancel a Confirmed rental (before handover). Car returns to Available.</summary>
    public Rental CancelRental(int rentalId)
    {
        var rental = _db.Rentals.Include(r => r.Car).FirstOrDefault(r => r.Id == rentalId)
            ?? throw new InvalidOperationException($"Rental {rentalId} not found.");

        if (rental.StatusId != RentalStatusId.Confirmed)
            throw new InvalidOperationException(
                $"Cannot cancel a rental in status {rental.StatusId}. Only Confirmed rentals can be cancelled.");

        rental.StatusId = RentalStatusId.Cancelled;
        rental.Car.StatusId = CarStatusId.Available;

        _db.SaveChanges();
        return GetRentalById(rental.Id)!;
    }

    /// <summary>Admin updates rental fields directly. Use sparingly.</summary>
    public Rental EditRental(int rentalId, EditRentalRequest req)
    {
        var rental = _db.Rentals.FirstOrDefault(r => r.Id == rentalId)
            ?? throw new InvalidOperationException($"Rental {rentalId} not found.");

        if (req.PlannedStart.HasValue)  rental.PlannedStart = req.PlannedStart.Value;
        if (req.PlannedEnd.HasValue)    rental.PlannedEnd   = req.PlannedEnd.Value;
        if (req.HandoverDate.HasValue)  rental.HandoverDate = req.HandoverDate;
        if (req.ReturnDate.HasValue)    rental.ReturnDate   = req.ReturnDate;
        if (req.TotalCost.HasValue)     rental.TotalCost    = req.TotalCost;
        if (req.StatusId.HasValue)      rental.StatusId     = req.StatusId.Value;
        if (req.ReturnMileage.HasValue) rental.ReturnMileage= req.ReturnMileage;
        if (req.Condition != null)      rental.Condition    = req.Condition;

        _db.SaveChanges();
        return GetRentalById(rental.Id)!;
    }
}
