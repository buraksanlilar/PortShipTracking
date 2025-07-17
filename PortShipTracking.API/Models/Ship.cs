using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortShipTracking.API.Models;

public class Ship
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ShipId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = "";

    [Required]
    [MaxLength(10)]
    [Column(TypeName = "varchar(10)")]
    public string IMO { get; set; } = "";

    [MaxLength(50)]
    public string Type { get; set; } = "";

    [MaxLength(50)]
    public string Flag { get; set; } = "";

    public int YearBuilt { get; set; }
}
