using Berauto.Backend.DTOs;
using Berauto.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Berauto.Backend;

public class DbManager
{
    private readonly CarRentalDbContext _db;

    public DbManager(CarRentalDbContext db)
    {
        _db = db;
    }

    // USERS
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

    public List<User> GetAllUsers() =>
        _db.Users.Include(u => u.Role).OrderBy(u => u.Name).ToList();

    public void DeleteUser(int userId)
    {
        var user = _db.Users.Include(u => u.Rentals).FirstOrDefault(u => u.Id == userId);

        if (user == null)
            throw new InvalidOperationException("A törölni kívánt felhasználó nem található a rendszerben.");

        bool hasActiveRentals = user.Rentals.Any(r =>
            r.StatusId != RentalStatusId.Completed && r.StatusId != RentalStatusId.Cancelled);

        if (hasActiveRentals)
            throw new InvalidOperationException("A felhasználó nem törölhető, mert jelenleg aktív vagy jövőbeli bérléssel/foglalással rendelkezik!");

        _db.Users.Remove(user);
        _db.SaveChanges();
    }

    // CARS
    public void AddCar(Car car)
    {
        _db.Cars.Add(car);
        _db.SaveChanges();
    }

    public Car UpdateCar(Car updates)
    {
        var existing = _db.Cars
            .Include(c => c.Fuel)
            .Include(c => c.Status)
            .FirstOrDefault(c => c.Id == updates.Id);

        if (existing is null)
            throw new InvalidOperationException("A módosítani kívánt autó nem található a rendszerben.");

        var regTaken = _db.Cars
            .Any(c => c.Id != updates.Id && c.RegNum == updates.RegNum);
        if (regTaken)
            throw new InvalidOperationException($"Ez a rendszám már használatban van egy másik autónál: {updates.RegNum}");

        existing.RegNum = (updates.RegNum ?? "").Trim();
        existing.Brand = (updates.Brand ?? "").Trim();
        existing.Model = (updates.Model ?? "").Trim();
        existing.Mileage = updates.Mileage;
        existing.Fee = updates.Fee;
        existing.FuelId = updates.FuelId;
        existing.IsRentable = updates.IsRentable;

        _db.SaveChanges();
        _db.Entry(existing).Reference(c => c.Fuel).Load();
        return existing;
    }

    public Car? GetCarById(int id) =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status).FirstOrDefault(c => c.Id == id);

    private IQueryable<Car> CarsWithIncludes() =>
        _db.Cars.Include(c => c.Fuel).Include(c => c.Status).Where(c => !c.IsDeleted);

    public List<Car> GetAvailableCars() =>
        CarsWithIncludes().Where(c => c.StatusId == CarStatusId.Available).ToList();

    public List<Car> GetAvailableRentableCars(DateOnly? startDate = null, DateOnly? endDate = null)
    {
        var query = CarsWithIncludes().Where(c =>
            c.IsRentable
            && c.StatusId != CarStatusId.Maintenance
            && c.StatusId != CarStatusId.AwaitingInspection);

        if (startDate.HasValue && endDate.HasValue)
        {
            if (endDate.Value < startDate.Value)
            {
                throw new InvalidOperationException("A visszaadás dátuma nem lehet korábbi, mint az átvételé.");
            }

            var start = startDate.Value.ToDateTime(TimeOnly.MinValue);
            var end = endDate.Value.ToDateTime(TimeOnly.MaxValue);

            query = query.Where(c => !c.Rentals.Any(r =>
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

    public Car SetCarMaintenance(int carId)
    {
        var car = _db.Cars.FirstOrDefault(c => c.Id == carId)
            ?? throw new InvalidOperationException("A kiválasztott autó nem található.");

        if (car.StatusId == CarStatusId.Rented || car.StatusId == CarStatusId.Reserved)
            throw new InvalidOperationException("Az autó jelenleg bérlés alatt vagy lefoglalva áll, így nem küldhető szervizbe. Előbb zárja le vagy törölje az aktív bérlést!");

        car.StatusId = CarStatusId.Maintenance;
        _db.SaveChanges();
        return car;
    }

    public Car ActivateCar(int carId)
    {
        var car = _db.Cars.FirstOrDefault(c => c.Id == carId)
            ?? throw new InvalidOperationException("A kiválasztott autó nem található.");

        car.StatusId = CarStatusId.Available;
        _db.SaveChanges();
        return car;
    }

    // RENTALS
    private IQueryable<Rental> RentalsWithIncludes() =>
        _db.Rentals
            .Include(r => r.Car)
            .Include(r => r.User)
            .Include(r => r.Status);

    public List<Rental> GetAllRentals() =>
    RentalsWithIncludes()
        .OrderByDescending(r => r.PlannedStart)
        .ToList();

    public List<Rental> GetRentalsByUser(int userId) =>
         RentalsWithIncludes().Where(r => r.UserId == userId)
        .OrderByDescending(r=>r.PlannedStart)
        .ToList();

    public Rental? GetRentalById(int rentalId) =>
        RentalsWithIncludes().FirstOrDefault(r => r.Id == rentalId);

    public Rental ReserveCar(int carId, int userId, DateTime plannedStart, DateTime plannedEnd)
    {
        if (plannedEnd.Date < plannedStart.Date)
            throw new InvalidOperationException("A visszaadás dátuma nem lehet korábbi, mint az átvételé.");

        var car = _db.Cars
            .Include(c => c.Rentals)
            .FirstOrDefault(c => c.Id == carId)
            ?? throw new InvalidOperationException("A kiválasztott autó nem található a rendszerben.");

        if (!car.IsRentable)
            throw new InvalidOperationException("Ez a jármű jelenleg nem kiadható.");

        if (car.StatusId == CarStatusId.Maintenance || car.StatusId == CarStatusId.AwaitingInspection)
            throw new InvalidOperationException("Sajnáljuk, de a jármű jelenleg nem elérhető (szervizben vagy szemlére vár).");

        bool hasCollision = car.Rentals.Any(r =>
            (r.StatusId == RentalStatusId.Confirmed || r.StatusId == RentalStatusId.Active)
            && r.PlannedStart < plannedEnd
            && r.PlannedEnd > plannedStart);

        if (hasCollision)
            throw new InvalidOperationException("Sajnáljuk, de ezt az autót a választott időszakra időközben már lefoglalták.");

        var days = Math.Max(1, (int)Math.Ceiling((plannedEnd.Date - plannedStart.Date).TotalDays));
        var totalCost = days * car.Fee;

        var rental = new Rental
        {
            CarId = carId,
            UserId = userId,
            StatusId = RentalStatusId.Confirmed,
            PlannedStart = plannedStart,
            PlannedEnd = plannedEnd,
            TotalCost = totalCost
        };

        if (car.StatusId == CarStatusId.Available)
        {
            car.StatusId = CarStatusId.Reserved;
        }

        _db.Rentals.Add(rental);
        _db.SaveChanges();

        return GetRentalById(rental.Id)!;
    }

    public Rental HandoverRental(int rentalId)
    {
        var rental = _db.Rentals.Include(r => r.Car).FirstOrDefault(r => r.Id == rentalId)
            ?? throw new InvalidOperationException("A keresett bérlési azonosító nem található.");

        if (rental.StatusId != RentalStatusId.Confirmed)
            throw new InvalidOperationException("Csak megerősített státuszú foglalást lehet átadni az ügyfélnek.");

        rental.StatusId = RentalStatusId.Active;
        rental.HandoverDate = DateTime.UtcNow;
        rental.Car.StatusId = CarStatusId.Rented;

        _db.SaveChanges();
        return GetRentalById(rental.Id)!;
    }

    public Rental ReturnRental(int rentalId)
    {
        var rental = _db.Rentals.Include(r => r.Car).FirstOrDefault(r => r.Id == rentalId)
            ?? throw new InvalidOperationException("A keresett bérlési azonosító nem található.");

        if (rental.StatusId != RentalStatusId.Active)
            throw new InvalidOperationException("Csak folyamatban lévő, aktív bérlést lehet visszahozottra állítani.");

        rental.StatusId = RentalStatusId.Returned;
        rental.ReturnDate = DateTime.UtcNow;
        rental.Car.StatusId = CarStatusId.AwaitingInspection;

        _db.SaveChanges();
        return GetRentalById(rental.Id)!;
    }

    public Rental InspectRental(int rentalId, int? returnMileage, string? condition, bool accept)
    {
        var rental = _db.Rentals
            .Include(r => r.Car)
            .Include(r => r.User)
            .FirstOrDefault(r => r.Id == rentalId)
            ?? throw new InvalidOperationException("A keresett bérlési folyamat nem található.");

        if (rental.StatusId != RentalStatusId.Returned)
            throw new InvalidOperationException("Csak visszahozott, ellenőrzésre váró járműveken végezhető el a szemle.");

        if (returnMileage.HasValue)
        {
            if (returnMileage.Value < rental.Car.Mileage)
                throw new InvalidOperationException($"A leadáskori kilométeróra állás nem lehet alacsonyabb, mint amivel a gépjármű elhagyta a telephelyet ({rental.Car.Mileage} km).");

            rental.ReturnMileage = returnMileage.Value;
            rental.Car.Mileage = returnMileage.Value;
        }

        rental.Condition = condition;
        rental.StatusId = RentalStatusId.Completed;
        rental.Car.StatusId = accept ? CarStatusId.Available : CarStatusId.Maintenance;

        if (!_db.Receipts.Any(r => r.RentalId == rental.Id))
        {
            var days = Math.Max(1, (int)Math.Ceiling((rental.PlannedEnd - rental.PlannedStart).TotalDays));
            _db.Receipts.Add(new Receipt
            {
                RentalId = rental.Id,
                UserId = rental.UserId,
                IssuedAt = DateTime.UtcNow,
                Amount = rental.TotalCost ?? 0,
                DaysRented = days,
                CarRegNum = rental.Car.RegNum,
                CarBrand = rental.Car.Brand,
                CarModel = rental.Car.Model,
                UserName = rental.User.Name,
                UserEmail = rental.User.Email,
                UserAddress = rental.User.Address,
            });
        }

        _db.SaveChanges();
        return GetRentalById(rental.Id)!;
    }

    // Receipts
    public List<Receipt> GetReceiptsByUser(int userId) =>
        _db.Receipts.Where(r => r.UserId == userId).OrderByDescending(r => r.Id).ToList();

    public Receipt? GetReceiptById(int id) =>
        _db.Receipts.FirstOrDefault(r => r.Id == id);

    public Receipt? GetReceiptByRentalId(int rentalId) =>
        _db.Receipts.FirstOrDefault(r => r.RentalId == rentalId);

    public Rental CancelRental(int rentalId)
    {
        var rental = _db.Rentals.Include(r => r.Car).FirstOrDefault(r => r.Id == rentalId)
            ?? throw new InvalidOperationException("A lemondani kívánt bérlés nem található.");

        if (rental.StatusId != RentalStatusId.Confirmed)
            throw new InvalidOperationException("Csak olyan foglalást lehet lemondani, amit még nem adtak át az ügyfélnek (Megerősítve állapotú).");

        rental.StatusId = RentalStatusId.Cancelled;
        rental.Car.StatusId = CarStatusId.Available;

        _db.SaveChanges();
        return GetRentalById(rental.Id)!;
    }

    public Rental EditRental(int rentalId, EditRentalRequest req)
    {
        var rental = _db.Rentals.FirstOrDefault(r => r.Id == rentalId)
            ?? throw new InvalidOperationException("A szerkeszteni kívánt bérlés nem található.");

        if (req.PlannedStart.HasValue) rental.PlannedStart = req.PlannedStart.Value;
        if (req.PlannedEnd.HasValue) rental.PlannedEnd = req.PlannedEnd.Value;
        if (req.HandoverDate.HasValue) rental.HandoverDate = req.HandoverDate;
        if (req.ReturnDate.HasValue) rental.ReturnDate = req.ReturnDate;
        if (req.TotalCost.HasValue) rental.TotalCost = req.TotalCost;
        if (req.StatusId.HasValue) rental.StatusId = req.StatusId.Value;
        if (req.ReturnMileage.HasValue) rental.ReturnMileage = req.ReturnMileage;
        if (req.Condition != null) rental.Condition = req.Condition;

        _db.SaveChanges();
        return GetRentalById(rental.Id)!;
    }

    public Rental ReserveCarAsGuest(
        int carId,
        DateTime plannedStart,
        DateTime plannedEnd,
        string name,
        string email,
        string phone,
        string address,
        string drivingLicence)
    {
        var existing = _db.Users.FirstOrDefault(u => u.Email == email);
        if (existing != null)
            throw new InvalidOperationException("Ez az email cím már regisztrált rendszerünkben. Kérjük, a foglalás előtt jelentkezzen be a fiókjába!");

        using var tx = _db.Database.BeginTransaction();

        var guest = new User
        {
            RoleId = RoleId.Client,
            Name = name.Trim(),
            Email = email.Trim(),
            PasswordHash = null,
            Phone = phone.Trim(),
            Address = address.Trim(),
            DrivingLicence = drivingLicence.Trim(),
        };
        _db.Users.Add(guest);
        _db.SaveChanges();

        var rental = ReserveCar(carId, guest.Id, plannedStart, plannedEnd);

        tx.Commit();
        return rental;
    }

    public bool CarExistsWithRegNum(string regNum)
    {
        if (string.IsNullOrWhiteSpace(regNum)) return false;

        var cleaned = regNum.Trim().ToUpper();
        return _db.Cars.Any(c => c.RegNum.ToUpper() == cleaned);
    }

    public void DeleteCar(int carId)
    {
         var car = _db.Cars.FirstOrDefault(c => c.Id == carId)
            ?? throw new InvalidOperationException("A jármű nem található.");

         car.IsDeleted = true;

        _db.SaveChanges();
    }
    public List<Car> GetAllCarsForAdmin() =>
    CarsWithIncludes().OrderBy(c => c.Brand).ThenBy(c => c.Model).ToList();
}