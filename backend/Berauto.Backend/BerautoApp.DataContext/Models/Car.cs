using System;
using System.Collections.Generic;

namespace Berauto.Models;

public partial class Car
{
    public int Id { get; set; }

    public string RegNum { get; set; } = null!;

    public string Brand { get; set; } = null!;

    public string Model { get; set; } = null!;

    public int Mileage { get; set; }

    public bool IsRentable { get; set; }

    public int Fee { get; set; }

    public int FuelId { get; set; }

    public int StatusId { get; set; }

    public virtual Fuel Fuel { get; set; } = null!;

    public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();

    public virtual CarStatus Status { get; set; } = null!;
    
    public override string ToString()
    {
        return $"{RegNum} - {Brand} {Model} {Fuel}";
    }

}
