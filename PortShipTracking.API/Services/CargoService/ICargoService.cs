using PortShipTracking.API.Models;

namespace PortShipTracking.API.Services.CargoService
{
    public interface ICargoService
    {
        Task<List<Cargo>> GetAllAsync();
        Task<Cargo?> GetByIdAsync(int id);
        Task<Cargo> CreateAsync(Cargo cargo);
        Task<bool> UpdateAsync(int id, Cargo cargo);
        Task<bool> DeleteAsync(int id);
    }
}
