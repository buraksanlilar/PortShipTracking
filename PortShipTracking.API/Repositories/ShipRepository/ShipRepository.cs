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
        public async Task<List<Ship>> GetPagedAsync(int page, int pageSize)
        {
            return await _context.Ships
                .OrderBy(s => s.ShipId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
        public async Task<int> GetTotalCountAsync()
        {
            return await _context.Ships.CountAsync();
        }
        public async Task<object> SearchPagedAsync(int page, int pageSize, int? shipId, string? name, string? imo, string? type, string? flag, int? yearBuilt)
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

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(s => s.ShipId)
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
