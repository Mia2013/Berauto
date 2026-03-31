namespace Berauto.Backend.DTOs
{
    public class RentalDto
    {
        public int Id { get; set; }
        public string CarRegNum { get; set; } = null!;
        public string CarBrand { get; set; } = null!;
        public string CarModel { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime? RequestDate { get; set; }
        public DateTime? HandoverDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public int? TotalCost { get; set; }
    }
}