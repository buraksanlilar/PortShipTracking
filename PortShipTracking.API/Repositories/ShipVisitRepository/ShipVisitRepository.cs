using Microsoft.EntityFrameworkCore;
using PortShipTracking.API.Data;
using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.ShipVisitRepository
{
    public class ShipVisitRepository : IShipVisitRepository
    {
        private readonly AppDbContext _context;

        public ShipVisitRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ShipVisit>> GetAllAsync()
        {
            return await _context.ShipVisits
                .Include(v => v.Ship)
                .Include(v => v.Port)
                .ToListAsync();
        }

        public async Task<ShipVisit?> GetByIdAsync(int id)
        {
            return await _context.ShipVisits
                .Include(v => v.Ship)
                .Include(v => v.Port)
                .FirstOrDefaultAsync(v => v.VisitId == id);
        }

        public async Task AddAsync(ShipVisit visit)
        {
            await _context.ShipVisits.AddAsync(visit);
        }

        public void Update(ShipVisit visit)
        {
            _context.ShipVisits.Update(visit);
        }

        public void Delete(ShipVisit visit)
        {
            _context.ShipVisits.Remove(visit);
        }
        public async Task<object> SearchPagedAsync(int page, int pageSize, int? shipId, int? portId, string? purpose, DateTime? arrivalDate, DateTime? departureDate)
        {
            var query = _context.ShipVisits.AsQueryable();

            if (shipId.HasValue)
                query = query.Where(v => v.ShipId == shipId.Value);

            if (portId.HasValue)
                query = query.Where(v => v.PortId == portId.Value);

            if (!string.IsNullOrWhiteSpace(purpose))
                query = query.Where(v => v.Purpose.Contains(purpose));

            if (arrivalDate.HasValue)
                query = query.Where(v => v.ArrivalDate.Date == arrivalDate.Value.Date);

            if (departureDate.HasValue)
                query = query.Where(v => v.DepartureDate.HasValue && v.DepartureDate.Value.Date == departureDate.Value.Date);

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(v => v.VisitId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new
            {
                TotalCount = totalCount,
                Items = items
            };
        }



        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
