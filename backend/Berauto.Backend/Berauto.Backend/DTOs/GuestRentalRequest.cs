using System.ComponentModel.DataAnnotations;

namespace Berauto.Backend.DTOs
{
    // Body of POST /api/Rentals/guest — bundles the booking with full personal data.
    public class GuestRentalRequest
    {
        // Booking
        [Required] public int CarId { get; set; }
        [Required] public DateTime PlannedStart { get; set; }
        [Required] public DateTime PlannedEnd { get; set; }

        // Personal data (mirrors what registration captures)
        [Required, StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = "";

        [Required, EmailAddress, StringLength(100)]
        public string Email { get; set; } = "";

        [Required, StringLength(20, MinimumLength = 4)]
        public string Phone { get; set; } = "";

        [Required, StringLength(255, MinimumLength = 4)]
        public string Address { get; set; } = "";

        [Required, StringLength(20, MinimumLength = 4)]
        public string DrivingLicence { get; set; } = "";
    }
}