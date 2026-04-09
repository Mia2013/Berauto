using System;
using System.Collections.Generic;

namespace Berauto.Models;

public partial class Service
{
    public int Id { get; set; }

    public int CarId { get; set; }

    public DateTime? EntryDate { get; set; }

    public DateTime? ReturnDate { get; set; }

    public int Mileage { get; set; }

    public string Maintenance { get; set; } = null!;

    public virtual Car Car { get; set; } = null!;
}
