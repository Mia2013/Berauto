using System;
using System.Collections.Generic;

namespace Berauto.Models;

public partial class CarStatus
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Car> Cars { get; set; } = new List<Car>();
    
    public override string ToString()
    {
        return $"{Name}";
    }
}
