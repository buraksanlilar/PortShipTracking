namespace PortShipTracking.API.Dtos.CargoDto;

public class CreateCargoDto
{
    public int ShipId { get; set; }

    public string Description { get; set; } = "";

    public decimal WeightTon { get; set; }

    public string CargoType { get; set; } = "";
}
