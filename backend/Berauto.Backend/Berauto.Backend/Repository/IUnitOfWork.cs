using Berauto.Backend.Models;

namespace Berauto.Backend.Repository;

public interface IUnitOfWork : IDisposable
{
    IRepository<Car> Cars { get; }
    IRepository<Fuel> Fuels { get; }
    IRepository<Rental> Rentals { get; }
    IRepository<RentalStatus> RentalStatuses { get; }
    IRepository<User> Users { get; }
    IRepository<Role> Roles { get; }
    IRepository<Service> Services { get; }

    Task<int> CompleteAsync();
}