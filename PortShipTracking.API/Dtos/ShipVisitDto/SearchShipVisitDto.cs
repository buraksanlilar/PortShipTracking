public class SearchShipVisitDto
{
    public int? VisitId { get; set; }
    public int? ShipId { get; set; }
    public string? ShipName { get; set; }
    public int? PortId { get; set; }
    public string? PortName { get; set; }
    public string? Purpose { get; set; }

    public DateTime? ArrivalDateStart { get; set; }
    public DateTime? ArrivalDateEnd { get; set; }
    public DateTime? DepartureDateStart { get; set; }
    public DateTime? DepartureDateEnd { get; set; }
}
