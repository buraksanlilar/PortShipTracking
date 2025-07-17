using PortShipTracking.API.Models;
using PortShipTracking.API.Repositories.CargoRepository;

namespace PortShipTracking.API.Services.CargoService
{
    public class CargoService : ICargoService
    {
        private readonly ICargoRepository _repository;

        public CargoService(ICargoRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Cargo>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Cargo?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Cargo> CreateAsync(Cargo cargo)
        {
            await _repository.AddAsync(cargo);
            await _repository.SaveAsync();
            return cargo;
        }

        public async Task<bool> UpdateAsync(int id, Cargo cargo)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return false;

            existing.ShipId = cargo.ShipId;
            existing.Description = cargo.Description;
            existing.WeightTon = cargo.WeightTon;
            existing.CargoType = cargo.CargoType;

            await _repository.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return false;

            _repository.Delete(existing);
            await _repository.SaveAsync();
            return true;
        }
    }
}
