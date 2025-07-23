using PortShipTracking.API.Models;
using System.Linq;

namespace PortShipTracking.API.Repositories.CargoRepository
{
    public interface ICargoRepository
    {
        Task<List<Cargo>> GetAllAsync();
        Task<Cargo?> GetByIdAsync(int id);
        Task AddAsync(Cargo cargo);
        void Update(Cargo cargo);
        void Delete(Cargo cargo);
        Task SaveAsync();

        // ✅ NEW
        Task<IQueryable<Cargo>> GetAllQueryableAsync();
    }
}
