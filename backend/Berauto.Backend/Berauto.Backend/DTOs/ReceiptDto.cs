namespace Berauto.Backend.DTOs
{
    public class ReceiptDto
    {
        public int Id { get; set; }

        /// <summary>Formatted human-readable receipt number, e.g. "BR-2026-00042".</summary>
        public string ReceiptNumber { get; set; } = null!;

        public int RentalId { get; set; }
        public int UserId { get; set; }
        public DateTime IssuedAt { get; set; }
        public int Amount { get; set; }
        public int DaysRented { get; set; }

        public string CarRegNum { get; set; } = null!;
        public string CarBrand { get; set; } = null!;
        public string CarModel { get; set; } = null!;

        public string UserName { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
        public string? UserAddress { get; set; }
    }
}
