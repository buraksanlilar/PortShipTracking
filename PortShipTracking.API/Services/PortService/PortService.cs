using PortShipTracking.API.Models;
using PortShipTracking.API.Repositories.PortRepository;

namespace PortShipTracking.API.Services.PortService
{
    public class PortService : IPortService
    {
        private readonly IPortRepository _repository;

        public PortService(IPortRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Port>> GetAllPortsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Port?> GetPortByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Port> CreatePortAsync(Port port)
        {
            await _repository.AddAsync(port);
            await _repository.SaveAsync();
            return port;
        }

        public async Task<bool> UpdatePortAsync(int id, Port port)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return false;

            existing.Name = port.Name;
            existing.Country = port.Country;
            existing.City = port.City;

            await _repository.SaveAsync();
            return true;
        }

        public async Task<bool> DeletePortAsync(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return false;

            _repository.Delete(existing);
            await _repository.SaveAsync();
            return true;
        }
        public async Task<object> SearchPagedAsync(int page, int pageSize, int? portId, string? name, string? country, string? city)
        {
            return await _repository.SearchPagedAsync(page, pageSize, portId, name, country, city);
        }

    }
}
