using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortShipTracking.API.Models;

public class Cargo
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int CargoId { get; set; }

    [Required]
    public int ShipId { get; set; }

    [ForeignKey("ShipId")]
    public Ship Ship { get; set; } = null!;

    [MaxLength(200)]
    public string Description { get; set; } = "";

    [Column(TypeName = "decimal(10,2)")]
    public decimal WeightTon { get; set; } = 0.0m;

    [MaxLength(50)]
    public string CargoType { get; set; } = "";
}
