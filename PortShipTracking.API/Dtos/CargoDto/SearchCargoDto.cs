namespace PortShipTracking.API.Dtos.CargoDto;

public class SearchCargoDto
{
    public int? CargoId { get; set; }
    public int? ShipId { get; set; }
    public string? ShipName { get; set; }
    public string? Description { get; set; }
    public decimal? WeightTon { get; set; }
    public string? CargoType { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
