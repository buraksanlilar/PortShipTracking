using PortShipTracking.API.Models;

namespace PortShipTracking.API.Services.ShipService
{
    public interface IShipService
    {
        Task<List<Ship>> GetAllShipsAsync();
        Task<Ship?> GetShipByIdAsync(int id);
        Task<Ship> CreateShipAsync(Ship ship);
        Task<bool> UpdateShipAsync(int id, Ship ship);
        Task<bool> DeleteShipAsync(int id);
    }
}
