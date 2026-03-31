namespace Berauto.Backend.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? DrivingLicence { get; set; }
        public string Role { get; set; } = null!;
    }
}