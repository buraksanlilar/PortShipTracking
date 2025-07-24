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
        public async Task<object> SearchPagedAsync(int page, int pageSize, int? assignmentId, int? shipId, int? crewId, DateTime? assignmentDate)
        {
            var query = _context.ShipCrewAssignments.AsQueryable();

            if (assignmentId.HasValue)
                query = query.Where(a => a.AssignmentId == assignmentId.Value);
            if (shipId.HasValue)
                query = query.Where(a => a.ShipId == shipId.Value);
            if (crewId.HasValue)
                query = query.Where(a => a.CrewId == crewId.Value);
            if (assignmentDate.HasValue)
                query = query.Where(a => a.AssignmentDate.Date == assignmentDate.Value.Date);

            var totalCount = await query.CountAsync();
            var items = await query
                .Include(a => a.Ship)
                .Include(a => a.CrewMember)
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
