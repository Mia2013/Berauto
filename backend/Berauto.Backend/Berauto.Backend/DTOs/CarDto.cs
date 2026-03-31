namespace Berauto.Backend.DTOs
{
    public class CarDto
    {
        public int Id { get; set; }
        public string RegNum { get; set; } = null!;
        public string Brand { get; set; } = null!;
        public string Model { get; set; } = null!;
        public int Mileage { get; set; }
        public bool IsRentable { get; set; }
        public int Fee { get; set; }
        public string Fuel { get; set; } = null!;
        public string Status { get; set; } = null!;
    }
}