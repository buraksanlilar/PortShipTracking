using PortShipTracking.API.Models;

namespace PortShipTracking.API.Services.ShipVisitService
{
    public interface IShipVisitService
    {
        Task<List<ShipVisit>> GetAllAsync();
        Task<ShipVisit?> GetByIdAsync(int id);
        Task<ShipVisit> CreateAsync(ShipVisit visit);
        Task<bool> UpdateAsync(int id, ShipVisit visit);
        Task<bool> DeleteAsync(int id);
        Task<object> SearchPagedAsync(int page, int pageSize, int? visitId, int? shipId, int? portId, string? purpose, DateTime? arrivalDateStart,
            DateTime? arrivalDateEnd,
            DateTime? departureDateStart,
            DateTime? departureDateEnd);


    }
}
