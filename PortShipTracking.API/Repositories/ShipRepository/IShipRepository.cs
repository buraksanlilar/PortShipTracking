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
        Task SaveAsync();
    }
}
