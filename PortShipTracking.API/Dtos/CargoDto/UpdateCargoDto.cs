namespace PortShipTracking.API.Dtos.CargoDto;

public class UpdateCargoDto
{
    public int ShipId { get; set; }

    public string Description { get; set; } = "";

    public decimal WeightTon { get; set; }

    public string CargoType { get; set; } = "";
}
