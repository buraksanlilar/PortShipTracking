using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortShipTracking.API.Models;

public class CrewMember
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int CrewId { get; set; }

    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = "";

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = "";

    [MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = "";

    [MaxLength(20)]
    [Phone]
    public string PhoneNumber { get; set; } = "";

    [Required]
    [MaxLength(50)]
    public string Role { get; set; } = "";
}