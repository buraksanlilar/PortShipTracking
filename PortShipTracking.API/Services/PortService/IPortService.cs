using PortShipTracking.API.Models;

namespace PortShipTracking.API.Services.PortService
{
    public interface IPortService
    {
        Task<List<Port>> GetAllPortsAsync();
        Task<Port?> GetPortByIdAsync(int id);
        Task<Port> CreatePortAsync(Port port);
        Task<bool> UpdatePortAsync(int id, Port port);
        Task<bool> DeletePortAsync(int id);
        Task<object> SearchPagedAsync(int page, int pageSize, int? portId, string? name, string? country, string? city);
    }
}
