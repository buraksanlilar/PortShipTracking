using Microsoft.EntityFrameworkCore;
using PortShipTracking.API.Data;
using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.ShipCrewAssignmentRepository
{
    public class ShipCrewAssignmentRepository : IShipCrewAssignmentRepository
    {
        private readonly AppDbContext _context;

        public ShipCrewAssignmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ShipCrewAssignment>> GetAllAsync()
        {
            return await _context.ShipCrewAssignments
                .Include(a => a.Ship)
                .Include(a => a.CrewMember)
                .ToListAsync();
        }

        public async Task<ShipCrewAssignment?> GetByIdAsync(int id)
        {
            return await _context.ShipCrewAssignments
                .Include(a => a.Ship)
                .Include(a => a.CrewMember)
                .FirstOrDefaultAsync(a => a.AssignmentId == id);
        }

        public async Task AddAsync(ShipCrewAssignment assignment)
        {
            await _context.ShipCrewAssignments.AddAsync(assignment);
        }

        public void Update(ShipCrewAssignment assignment)
        {
            _context.ShipCrewAssignments.Update(assignment);
        }

        public void Delete(ShipCrewAssignment assignment)
        {
            _context.ShipCrewAssignments.Remove(assignment);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
