using Berauto.Backend.Data;
using Berauto.Backend.Models;

namespace Berauto.Backend.Repository;

public class SimpleUnitOfWork : IUnitOfWork
{
    private readonly CarRentalDbContext _context;

    // Privát mezők a cache-eléshez
    private IRepository<Car>? _cars;
    private IRepository<Fuel>? _fuels;
    private IRepository<Rental>? _rentals;
    private IRepository<RentalStatus>? _rentalStatuses;
    private IRepository<User>? _users;
    private IRepository<Role>? _roles;
    private IRepository<Service>? _services;

    public SimpleUnitOfWork(CarRentalDbContext context)
    {
        _context = context;
    }

    public IRepository<Car> Cars => _cars ??= new GenericRepository<Car>(_context);
    public IRepository<Fuel> Fuels => _fuels ??= new GenericRepository<Fuel>(_context);
    public IRepository<Rental> Rentals => _rentals ??= new GenericRepository<Rental>(_context);
    public IRepository<RentalStatus> RentalStatuses => _rentalStatuses ??= new GenericRepository<RentalStatus>(_context);
    public IRepository<User> Users => _users ??= new GenericRepository<User>(_context);
    public IRepository<Role> Roles => _roles ??= new GenericRepository<Role>(_context);
    public IRepository<Service> Services => _services ??= new GenericRepository<Service>(_context);

    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}