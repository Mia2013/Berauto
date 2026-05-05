using System;
using System.Collections.Generic;

namespace Berauto.Backend.Models;

public partial class RentalStatus
{
    public int Id { get; set; }

    public string StatusName { get; set; } = String.Empty;

    public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();
}
