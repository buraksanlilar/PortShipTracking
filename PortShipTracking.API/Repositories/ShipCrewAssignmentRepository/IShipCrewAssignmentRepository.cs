using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.ShipCrewAssignmentRepository
{
    public interface IShipCrewAssignmentRepository
    {
        Task<List<ShipCrewAssignment>> GetAllAsync();
        Task<ShipCrewAssignment?> GetByIdAsync(int id);
        Task AddAsync(ShipCrewAssignment assignment);
        void Update(ShipCrewAssignment assignment);
        void Delete(ShipCrewAssignment assignment);
        Task<object> SearchPagedAsync(int page, int pageSize, int? assignmentId, int? shipId, int? crewId, DateTime? assignmentDate);
        Task SaveAsync();
    }
}
