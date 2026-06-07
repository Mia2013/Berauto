namespace Berauto.Backend.DTO
{
    // The "current user" shape returned by GET /api/Users/me and PUT /api/Users/me.
    // Notice: Role and DrivingLicence are returned but cannot be modified through the profile endpoint.
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? DrivingLicence { get; set; }
        public string Role { get; set; } = "";
    }
}