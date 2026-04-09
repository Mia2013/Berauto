using System;
using System.Collections.Generic;

namespace Berauto.Models;

public partial class RentalStatus
{
    public int Id { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();
}
