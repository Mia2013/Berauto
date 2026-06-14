using System.ComponentModel.DataAnnotations;

namespace Berauto.Backend.DTOs
{
    public class UpdateCarDto
    {
        [Required]
        [StringLength(10, ErrorMessage = "A rendszám maximum 10 karakter lehet.")]
        public string RegNum { get; set; } = "";

        [Required]
        [StringLength(15, ErrorMessage = "A márka maximum 15 karakter lehet.")]
        public string Brand { get; set; } = "";

        [Required]
        [StringLength(20, ErrorMessage = "A modell maximum 20 karakter lehet.")]
        public string Model { get; set; } = "";

        [Range(0, int.MaxValue, ErrorMessage = "A kilométeróra nem lehet negatív.")]
        public int Mileage { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "A napi díj nem lehet negatív.")]
        public int Fee { get; set; }

        [Required]
        public int FuelId { get; set; }

        public bool IsRentable { get; set; } = true;
    }
}