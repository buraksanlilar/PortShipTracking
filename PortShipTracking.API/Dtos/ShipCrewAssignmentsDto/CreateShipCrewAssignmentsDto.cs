namespace PortShipTracking.API.Dtos.ShipCrewAssignmentDto;

public class CreateShipCrewAssignmentDto
{
    public int ShipId { get; set; }
    public int CrewId { get; set; }
    public DateTime AssignmentDate { get; set; }
}
