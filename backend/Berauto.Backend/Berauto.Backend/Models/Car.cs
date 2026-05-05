using System;
using System.Collections.Generic;

namespace Berauto.Backend.Models;

public partial class Car
{
    public int Id { get; set; }

    public string RegNum { get; set; } = string.Empty;

    public string Brand { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int Mileage { get; set; }

    public bool IsRentable { get; set; }

    public int Fee { get; set; }

    public int FuelId { get; set; }

    public virtual Fuel? Fuel { get; set; }

    public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();

    public virtual ICollection<Service> Services { get; set; } = new List<Service>();

    public override string ToString()
    {
        return $"{Id} {Brand} {Model} {RegNum}";
    }
}
