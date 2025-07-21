using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.ShipRepository
{
    public interface IShipRepository
    {
        Task<List<Ship>> GetAllAsync();
        Task<Ship?> GetByIdAsync(int id);
        Task AddAsync(Ship ship);
        void Update(Ship ship);
        void Delete(Ship ship);
        Task<List<Ship>> SearchAsync(int? shipId, string? name, string? imo, string? type, string? flag, int? yearBuilt);
        Task<List<Ship>> GetPagedAsync(int page, int pageSize);
        Task<int> GetTotalCountAsync();
        Task<object> SearchPagedAsync(int page, int pageSize, int? shipId, string? name, string? imo, string? type, string? flag, int? yearBuilt);


        Task SaveAsync();
    }
}
