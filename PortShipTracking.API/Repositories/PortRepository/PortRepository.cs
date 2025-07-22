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
        public async Task<object> SearchPagedAsync(int page, int pageSize, int? portId, string? name, string? country, string? city)
        {
            var query = _context.Ports.AsQueryable();

            if (portId.HasValue)
                query = query.Where(p => p.PortId == portId.Value);
            if (!string.IsNullOrEmpty(name))
                query = query.Where(p => p.Name.Contains(name));
            if (!string.IsNullOrEmpty(country))
                query = query.Where(p => p.Country.Contains(country));
            if (!string.IsNullOrEmpty(city))
                query = query.Where(p => p.City.Contains(city));

            var totalCount = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

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
