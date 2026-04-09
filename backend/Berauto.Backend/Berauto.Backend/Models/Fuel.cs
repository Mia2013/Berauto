using System;
using System.Collections.Generic;

namespace Berauto.Models;

public partial class Fuel
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Car> Cars { get; set; } = new List<Car>();
}
