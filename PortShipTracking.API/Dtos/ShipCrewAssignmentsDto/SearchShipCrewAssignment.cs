namespace PortShipTracking.API.Dtos.CargoDto;

public class SearchShipCrewAssignmentDto
{
    public int? AssignmentId { get; set; }
    public int? ShipId { get; set; }
    public int? CrewId { get; set; }
    public DateTime? AssignmentDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
