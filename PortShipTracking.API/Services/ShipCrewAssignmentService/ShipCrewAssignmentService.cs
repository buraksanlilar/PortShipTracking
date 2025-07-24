using PortShipTracking.API.Models;
using PortShipTracking.API.Repositories.ShipCrewAssignmentRepository;

namespace PortShipTracking.API.Services.ShipCrewAssignmentService
{
    public class ShipCrewAssignmentService : IShipCrewAssignmentService
    {
        private readonly IShipCrewAssignmentRepository _repository;

        public ShipCrewAssignmentService(IShipCrewAssignmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ShipCrewAssignment>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<ShipCrewAssignment?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<ShipCrewAssignment> CreateAsync(ShipCrewAssignment assignment)
        {
            await _repository.AddAsync(assignment);
            await _repository.SaveAsync();
            return assignment;
        }

        public async Task<bool> UpdateAsync(int id, ShipCrewAssignment assignment)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return false;

            existing.ShipId = assignment.ShipId;
            existing.CrewId = assignment.CrewId;
            existing.AssignmentDate = assignment.AssignmentDate;

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
        public async Task<object> SearchPagedAsync(int page, int pageSize, int? assignmentId, int? shipId, int? crewId, DateTime? assignmentDate)
        {
            return await _repository.SearchPagedAsync(page, pageSize, assignmentId, shipId, crewId, assignmentDate);
        }

    }
}
