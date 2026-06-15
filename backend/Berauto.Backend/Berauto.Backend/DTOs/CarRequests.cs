using System.ComponentModel.DataAnnotations;

namespace Berauto.Backend.DTOs
{
    public class CreateCarRequest
    {
        [Required, MaxLength(10)]
        public string RegNum { get; set; } = null!;

        [Required, MaxLength(15)]
        public string Brand { get; set; } = null!;

        [Required, MaxLength(20)]
        public string Model { get; set; } = null!;

        [Range(0, int.MaxValue)]
        public int Mileage { get; set; }

        [Range(0, int.MaxValue)]
        public int Fee { get; set; }

        [Required]
        public int FuelId { get; set; }

        public int StatusId { get; set; }

        public bool IsRentable { get; set; } = true;

        public string ImgUrl { get; set; } = string.Empty;
    }
}
