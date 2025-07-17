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

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
