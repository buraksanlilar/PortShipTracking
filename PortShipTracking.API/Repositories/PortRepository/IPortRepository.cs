using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.PortRepository
{
    public interface IPortRepository
    {
        Task<List<Port>> GetAllAsync();
        Task<Port?> GetByIdAsync(int id);
        Task AddAsync(Port port);
        void Update(Port port);
        void Delete(Port port);
        Task<object> SearchPagedAsync(int page, int pageSize, int? portId, string? name, string? country, string? city);

        Task SaveAsync();
    }
}
