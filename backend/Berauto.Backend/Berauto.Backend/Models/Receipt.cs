
namespace Berauto.Backend.Models;

public partial class Receipt
{
    public int Id { get; set; }

    public int RentalId { get; set; }
    public int UserId { get; set; }

    public DateTime IssuedAt { get; set; }
    public int Amount { get; set; }

    public int DaysRented { get; set; }

    public string CarRegNum { get; set; } = string.Empty;
    public string CarBrand { get; set; } = string.Empty;
    public string CarModel { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string? UserAddress { get; set; }
}
