using System;
using System.Collections.Generic;

namespace Berauto.Backend.Models;

public partial class Fuel
{
    public int Id { get; set; }

    public string Name { get; set; } = String.Empty;

    public virtual ICollection<Car> Cars { get; set; } = new List<Car>();
}
