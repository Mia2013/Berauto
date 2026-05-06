namespace Berauto.Backend.DTO
{
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
    }
}
