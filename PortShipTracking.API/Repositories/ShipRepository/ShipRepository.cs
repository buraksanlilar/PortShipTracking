using Microsoft.EntityFrameworkCore;
using PortShipTracking.API.Data;
using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.ShipRepository
{
    public class ShipRepository : IShipRepository
    {
        private readonly AppDbContext _context;

        public ShipRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Ship>> GetAllAsync()
        {
            return await _context.Ships.ToListAsync();
        }

        public async Task<Ship?> GetByIdAsync(int id)
        {
            return await _context.Ships.FindAsync(id);
        }

        public async Task AddAsync(Ship ship)
        {
            await _context.Ships.AddAsync(ship);
        }

        public void Update(Ship ship)
        {
            _context.Ships.Update(ship);
        }

        public void Delete(Ship ship)
        {
            _context.Ships.Remove(ship);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
