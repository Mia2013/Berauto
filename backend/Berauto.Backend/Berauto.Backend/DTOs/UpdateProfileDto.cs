using System.ComponentModel.DataAnnotations;

namespace Berauto.Backend.DTOs
{
    public class UpdateProfileDto
    {
        [StringLength(20, ErrorMessage = "A telefonszám maximum 20 karakter lehet.")]
        public string? Phone { get; set; }

        [StringLength(255, ErrorMessage = "A cím maximum 255 karakter lehet.")]
        public string? Address { get; set; }
    }
}