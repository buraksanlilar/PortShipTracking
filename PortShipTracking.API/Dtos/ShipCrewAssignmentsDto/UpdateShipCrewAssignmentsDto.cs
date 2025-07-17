namespace PortShipTracking.API.Dtos.ShipCrewAssignmentDto;

public class UpdateShipCrewAssignmentDto
{
    public int ShipId { get; set; }
    public int CrewId { get; set; }
    public DateTime AssignmentDate { get; set; }
}
