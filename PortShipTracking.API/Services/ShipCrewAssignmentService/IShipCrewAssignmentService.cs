using PortShipTracking.API.Models;

namespace PortShipTracking.API.Services.ShipCrewAssignmentService
{
    public interface IShipCrewAssignmentService
    {
        Task<List<ShipCrewAssignment>> GetAllAsync();
        Task<ShipCrewAssignment?> GetByIdAsync(int id);
        Task<ShipCrewAssignment> CreateAsync(ShipCrewAssignment assignment);
        Task<bool> UpdateAsync(int id, ShipCrewAssignment assignment);
        Task<bool> DeleteAsync(int id);
    }
}
