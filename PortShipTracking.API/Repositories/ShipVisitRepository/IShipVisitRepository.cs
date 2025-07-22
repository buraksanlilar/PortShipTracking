using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.ShipVisitRepository
{
    public interface IShipVisitRepository
    {
        Task<List<ShipVisit>> GetAllAsync();
        Task<ShipVisit?> GetByIdAsync(int id);
        Task AddAsync(ShipVisit visit);
        void Update(ShipVisit visit);
        void Delete(ShipVisit visit);
        Task<object> SearchPagedAsync(int page, int pageSize, int? shipId, int? portId, string? purpose, DateTime? arrivalDate, DateTime? departureDate);


        Task SaveAsync();
    }
}
