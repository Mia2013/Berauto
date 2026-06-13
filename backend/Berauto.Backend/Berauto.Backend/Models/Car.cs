using System;
using System.Collections.Generic;

namespace Berauto.Models;

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

    public int StatusId { get; set; }
    public string ImgUrl { get; set; } = string.Empty;

    public virtual Fuel Fuel { get; set; } = null!;

    public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();

    public virtual CarStatus Status { get; set; } = null!;
    
    public override string ToString()
    {
        return $"{RegNum} - {Brand} {Model} {Fuel}";
    }

}
