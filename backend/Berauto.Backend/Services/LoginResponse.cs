using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public string Role { get; set; }
        public String Name { get; set; }
    }
}
