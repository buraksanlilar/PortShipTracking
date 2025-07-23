using Microsoft.EntityFrameworkCore;
using PortShipTracking.API.Models;
using PortShipTracking.API.Repositories.CargoRepository;
using PortShipTracking.API.Dtos.CargoDto;

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

        // ✅ NEW
        public async Task<object> SearchPagedAsync(SearchCargoDto dto)
        {
            var query = await _repository.GetAllQueryableAsync();

            if (dto.CargoId.HasValue)
                query = query.Where(c => c.CargoId == dto.CargoId);
            if (dto.ShipId.HasValue)
                query = query.Where(c => c.ShipId == dto.ShipId);
            if (!string.IsNullOrWhiteSpace(dto.ShipName))
                query = query.Where(c => c.Ship.Name.Contains(dto.ShipName));
            if (!string.IsNullOrWhiteSpace(dto.Description))
                query = query.Where(c => c.Description.Contains(dto.Description));
            if (!string.IsNullOrWhiteSpace(dto.CargoType))
                query = query.Where(c => c.CargoType.Contains(dto.CargoType));
            if (dto.WeightTon.HasValue)
                query = query.Where(c => c.WeightTon == dto.WeightTon);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((dto.Page - 1) * dto.PageSize)
                .Take(dto.PageSize)
                .ToListAsync();

            return new { totalCount, items };
        }
    }
}
