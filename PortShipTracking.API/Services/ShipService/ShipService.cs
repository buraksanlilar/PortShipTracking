using PortShipTracking.API.Models;
using PortShipTracking.API.Repositories.ShipRepository;

namespace PortShipTracking.API.Services.ShipService
{
    public class ShipService : IShipService
    {
        private readonly IShipRepository _repository;

        public ShipService(IShipRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Ship>> GetAllShipsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Ship?> GetShipByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Ship> CreateShipAsync(Ship ship)
        {
            await _repository.AddAsync(ship);
            await _repository.SaveAsync();
            return ship;
        }

        public async Task<bool> UpdateShipAsync(int id, Ship ship)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return false;

            // Mevcut nesneye gelen verileri set et
            existing.Name = ship.Name;
            existing.IMO = ship.IMO;
            existing.Type = ship.Type;
            existing.Flag = ship.Flag;
            existing.YearBuilt = ship.YearBuilt;

            await _repository.SaveAsync();
            return true;
        }


        public async Task<bool> DeleteShipAsync(int id)
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
