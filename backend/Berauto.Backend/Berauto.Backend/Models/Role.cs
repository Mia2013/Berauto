using System;
using System.Collections.Generic;

namespace Berauto.Backend.Models;

public partial class Role
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
