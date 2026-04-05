using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public enum Status
    {
        AlreadyExists,
        NotExists,
        Success,
        InvalidPassword
    }
   public  class LoginResult
    {
        public Status status { get;set; }
        public LoginResponse? Response { get; set; }
    }
}
