using Microsoft.EntityFrameworkCore;
using PortShipTracking.API.Data;
using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.PortRepository
{
    public class PortRepository : IPortRepository
    {
        private readonly AppDbContext _context;

        public PortRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Port>> GetAllAsync()
        {
            return await _context.Ports.ToListAsync();
        }

        public async Task<Port?> GetByIdAsync(int id)
        {
            return await _context.Ports.FindAsync(id);
        }

        public async Task AddAsync(Port port)
        {
            await _context.Ports.AddAsync(port);
        }

        public void Update(Port port)
        {
            _context.Ports.Update(port);
        }

        public void Delete(Port port)
        {
            _context.Ports.Remove(port);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
