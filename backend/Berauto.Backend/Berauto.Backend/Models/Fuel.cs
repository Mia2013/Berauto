
namespace Berauto.Backend.Models;


public partial class Fuel
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public virtual ICollection<Car> Cars { get; set; } = new List<Car>();

    public override string ToString()
    {
        return $"{Name}";
    }
}
