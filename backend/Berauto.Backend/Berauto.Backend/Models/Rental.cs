using System;
using System.Collections.Generic;

namespace Berauto.Backend.Models;

public partial class Rental
{
    public int Id { get; set; }

    public int CarId { get; set; }

    public int UserId { get; set; }

    public int StatusId { get; set; }

    public DateTime? RequestDate { get; set; }

    public DateTime? HandoverDate { get; set; }

    public DateTime? ReturnDate { get; set; }

    public int? TotalCost { get; set; }

    public virtual Car? Car { get; set; }

    public virtual RentalStatus? Status { get; set; }

    public virtual User? User { get; set; }
}
