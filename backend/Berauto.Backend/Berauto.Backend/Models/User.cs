namespace Berauto.Backend.Models;

public partial class User
{
    public int Id { get; set; }

    public int RoleId { get; set; }
    
    public int? RequestedRoleId { get; set; }
    
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? DrivingLicence { get; set; }

    public string PasswordHash { get; set; } = string.Empty;

    public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();

    public virtual Role Role { get; set; } = null!;
    public virtual Role? RequestedRole { get; set; }

    public override string ToString()
    {
        return $"{Name} ({Role}): {Email}";
    }
}
