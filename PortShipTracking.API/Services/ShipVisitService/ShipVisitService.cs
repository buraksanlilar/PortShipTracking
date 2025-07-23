using PortShipTracking.API.Models;
using PortShipTracking.API.Repositories.ShipVisitRepository;

namespace PortShipTracking.API.Services.ShipVisitService
{
    public class ShipVisitService : IShipVisitService
    {
        private readonly IShipVisitRepository _repository;

        public ShipVisitService(IShipVisitRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ShipVisit>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<ShipVisit?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<ShipVisit> CreateAsync(ShipVisit visit)
        {
            await _repository.AddAsync(visit);
            await _repository.SaveAsync();
            return visit;
        }

        public async Task<bool> UpdateAsync(int id, ShipVisit visit)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return false;

            existing.ShipId = visit.ShipId;
            existing.PortId = visit.PortId;
            existing.ArrivalDate = visit.ArrivalDate;
            existing.DepartureDate = visit.DepartureDate;
            existing.Purpose = visit.Purpose;

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
        public async Task<object> SearchPagedAsync(int page, int pageSize, int? visitId, int? shipId, int? portId, string? purpose, DateTime? arrivalDateStart,
            DateTime? arrivalDateEnd,
            DateTime? departureDateStart,
            DateTime? departureDateEnd)
        {
            return await _repository.SearchPagedAsync(page, pageSize, visitId, shipId, portId, purpose, arrivalDateStart,
                arrivalDateEnd, departureDateStart, departureDateEnd);
        }


    }
}
