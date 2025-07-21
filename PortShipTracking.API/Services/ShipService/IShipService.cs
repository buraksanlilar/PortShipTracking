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
        Task<List<Ship>> SearchAsync(int? shipId, string? name, string? imo, string? type, string? flag, int? yearBuilt);
        Task<List<Ship>> GetPagedAsync(int page, int pageSize);
        Task<int> GetTotalCountAsync();
        Task<object> SearchPagedAsync(int page, int pageSize, int? shipId, string? name, string? imo, string? type, string? flag, int? yearBuilt);



    }
}
