namespace Berauto.Backend.DTO;

public class RentalDTO
{
    public int Id { get; set; }
    public int CarId { get; set; }
    public string? CarBrand { get; set; }
    public string? CarModel { get; set; }
    public string? CarRegNum { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public int StatusId { get; set; }
    public string? StatusName { get; set; }
    public DateTime? RequestDate { get; set; }
    public DateTime? HandoverDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public int? TotalCost { get; set; }
}
