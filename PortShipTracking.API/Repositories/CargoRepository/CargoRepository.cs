using Microsoft.EntityFrameworkCore;
using PortShipTracking.API.Data;
using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.CargoRepository
{
    public class CargoRepository : ICargoRepository
    {
        private readonly AppDbContext _context;

        public CargoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Cargo>> GetAllAsync()
        {
            return await _context.Cargos
                .Include(c => c.Ship)
                .ToListAsync();
        }

        public async Task<Cargo?> GetByIdAsync(int id)
        {
            return await _context.Cargos
                .Include(c => c.Ship)
                .FirstOrDefaultAsync(c => c.CargoId == id);
        }

        public async Task AddAsync(Cargo cargo)
        {
            await _context.Cargos.AddAsync(cargo);
        }

        public void Update(Cargo cargo)
        {
            _context.Cargos.Update(cargo);
        }

        public void Delete(Cargo cargo)
        {
            _context.Cargos.Remove(cargo);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
