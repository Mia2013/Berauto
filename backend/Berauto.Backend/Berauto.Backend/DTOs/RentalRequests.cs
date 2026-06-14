using System.ComponentModel.DataAnnotations;

namespace Berauto.Backend.DTOs
{
    public class CreateRentalRequest
    {
        [Required]
        public int CarId { get; set; }

        [Required]
        public DateTime PlannedStart { get; set; }

        [Required]
        public DateTime PlannedEnd { get; set; }
    }

    public class EditRentalRequest
    {
        public DateTime? PlannedStart { get; set; }
        public DateTime? PlannedEnd { get; set; }
        public DateTime? HandoverDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public int? TotalCost { get; set; }
        public int? StatusId { get; set; }
        public string? Condition { get; set; }
        public int? ReturnMileage { get; set; }
    }

    public class InspectRequest
    {
        public int? ReturnMileage { get; set; }

        [MaxLength(500)]
        public string? Condition { get; set; }

        public bool Accept { get; set; } = true;
    }
}
