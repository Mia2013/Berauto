namespace Berauto.Backend.DTOs
{
    public class CarDto
    {
        public int Id { get; set; }
        public string RegNum { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Mileage { get; set; }
        public bool IsRentable { get; set; }
        public int Fee { get; set; }
        public string Fuel { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string ImgUrl { get; set; } = string.Empty;
    }
}