using System;

namespace Berauto.Models;

/// <summary>
/// One row generated when a rental is inspected (Returned → Completed).
/// Stores a permanent snapshot of the customer + car + amount so the receipt
/// stays valid even if the car or user is later edited or deleted.
/// </summary>
public partial class Receipt
{
    public int Id { get; set; }

    public int RentalId { get; set; }
    public int UserId { get; set; }

    public DateTime IssuedAt { get; set; }

    /// <summary>Final amount paid. Reuses the rental's TotalCost (fee × planned days).</summary>
    public int Amount { get; set; }

    public int DaysRented { get; set; }

    // Snapshot of the rented car (so a later car edit doesn't change historical receipts).
    public string CarRegNum { get; set; } = null!;
    public string CarBrand { get; set; } = null!;
    public string CarModel { get; set; } = null!;

    // Snapshot of the customer.
    public string UserName { get; set; } = null!;
    public string UserEmail { get; set; } = null!;
    public string? UserAddress { get; set; }
}
