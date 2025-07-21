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
        public async Task<List<Ship>> SearchAsync(int? shipId, string? name, string? imo, string? type, string? flag, int? yearBuilt)
        {
            var query = _context.Ships.AsQueryable();

            if (shipId.HasValue)
                query = query.Where(s => s.ShipId == shipId.Value);

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(s => s.Name != null && EF.Functions.Like(s.Name, $"%{name}%"));

            if (!string.IsNullOrWhiteSpace(imo))
                query = query.Where(s => s.IMO != null && EF.Functions.Like(s.IMO, $"%{imo}%"));

            if (!string.IsNullOrWhiteSpace(type))
                query = query.Where(s => s.Type != null && EF.Functions.Like(s.Type, $"%{type}%"));

            if (!string.IsNullOrWhiteSpace(flag))
                query = query.Where(s => s.Flag != null && EF.Functions.Like(s.Flag, $"%{flag}%"));

            if (yearBuilt.HasValue)
                query = query.Where(s => s.YearBuilt == yearBuilt.Value);

            return await query.ToListAsync();
        }


        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
