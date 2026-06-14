
namespace Berauto.Backend.Models;

public partial class Receipt
{
    public int Id { get; set; }

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
