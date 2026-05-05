using System;
using System.Collections.Generic;

namespace Berauto.Backend.Models;

public partial class User
{
    public int Id { get; set; }

    public int RoleId { get; set; }

    public string Name { get; set; } = String.Empty;

    public string Email { get; set; } = String.Empty;

    public string? PasswordHash { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? DrivingLicence { get; set; }

    public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();

    public virtual Role? Role { get; set; }

    public override string ToString()
    {
        return $"({Id}) {Name} {Email} {DrivingLicence}";
    }
}
