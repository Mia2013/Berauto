using System.ComponentModel.DataAnnotations;

namespace Berauto.Backend.DTO
{
    // Only Phone and Address are user-editable per the spec.
    // The controller intentionally ignores any other field, so users
    // cannot escalate their role or change their email here.
    public class UpdateProfileDto
    {
        [StringLength(20, ErrorMessage = "A telefonszám maximum 20 karakter lehet.")]
        public string? Phone { get; set; }

        [StringLength(255, ErrorMessage = "A cím maximum 255 karakter lehet.")]
        public string? Address { get; set; }
    }
}