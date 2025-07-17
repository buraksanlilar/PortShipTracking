namespace PortShipTracking.API.Dtos.ShipVisitDto;

public class CreateShipVisitDto
{
    public int ShipId { get; set; }
    public int PortId { get; set; }
    public DateTime ArrivalDate { get; set; }
    public DateTime? DepartureDate { get; set; }
    public string Purpose { get; set; } = "";
}
