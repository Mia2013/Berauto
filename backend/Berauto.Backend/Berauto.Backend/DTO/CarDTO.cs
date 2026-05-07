namespace Berauto.Backend.DTO;

public class CarDTO
{
    public int Id { get; set; }
    public string Brand { get; set; } = null!;
    public string Model { get; set; } = null!;
    public string RegNum { get; set; } = null!;
    public int Mileage { get; set; }
    public bool IsRentable { get; set; }
    //added this line:
    public int FuelId { get; set; }
    public string? FuelName { get; set; }
}