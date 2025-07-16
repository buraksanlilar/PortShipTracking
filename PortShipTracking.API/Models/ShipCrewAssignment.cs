using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortShipTracking.API.Models;

public class ShipCrewAssignment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AssignmentId { get; set; }

    [Required]
    public int ShipId { get; set; }

    [ForeignKey("ShipId")]
    public Ship Ship { get; set; } = null!;

    [Required]
    public int CrewId { get; set; }

    [ForeignKey("CrewId")]
    public CrewMember CrewMember { get; set; } = null!;

    [Required]
    public DateTime AssignmentDate { get; set; }
}