using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.CargoRepository
{
    public interface ICargoRepository
    {
        Task<List<Models.Cargo>> GetAllAsync();
        Task<Models.Cargo?> GetByIdAsync(int id);
        Task AddAsync(Models.Cargo cargo);
        void Update(Models.Cargo cargo);
        void Delete(Models.Cargo cargo);
        Task SaveAsync();
    }
}
