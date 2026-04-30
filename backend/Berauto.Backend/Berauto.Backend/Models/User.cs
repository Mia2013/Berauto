using System;
using System.Collections.Generic;

namespace Berauto.Models;

public partial class User
{
    public int Id { get; set; }

    public int RoleId { get; set; }

    public string Name { get; set; } = null!;
    public string? Username { get; set; }

    public string Email { get; set; } = null!;
    public string? PasswordHsh { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? DrivingLicence { get; set; }

    public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();

    public virtual Role Role { get; set; } = null!;
    
    public override string ToString()
    {
        return $"{Name} ({Role}): {Email}";
    }
}
