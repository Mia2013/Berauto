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

    public virtual Fuel Fuel { get; set; } = null!;

    public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();

    public virtual ICollection<Service> Services { get; set; } = new List<Service>();

    public override string ToString()
    {
        return $"{Id} {Brand} {Model} {RegNum}";
    }
}
