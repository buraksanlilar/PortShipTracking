using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortShipTracking.API.Models;

public class ShipVisit
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int VisitId { get; set; }

    [Required]
    public int ShipId { get; set; }

    [ForeignKey("ShipId")]
    public Ship Ship { get; set; } = null!;

    [Required]
    public int PortId { get; set; }

    [ForeignKey("PortId")]
    public Port Port { get; set; } = null!;

    [Required]
    public DateTime ArrivalDate { get; set; }

    public DateTime? DepartureDate { get; set; }

    [MaxLength(100)]
    public String Purpose { get; set; } = "";
}