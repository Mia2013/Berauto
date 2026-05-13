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
        /// <summary>The car's mileage at return. Optional — if provided, Car.Mileage is updated.</summary>
        public int? ReturnMileage { get; set; }

        /// <summary>Free-text condition notes from the admin's inspection.</summary>
        [MaxLength(500)]
        public string? Condition { get; set; }

        /// <summary>
        /// If true, the car is accepted and goes back to Available.
        /// If false, the car is moved to Maintenance instead.
        /// </summary>
        public bool Accept { get; set; } = true;
    }
}
