using Microsoft.EntityFrameworkCore;
using PortShipTracking.API.Data;
using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.CrewMemberRepository
{
    public class CrewMemberRepository : ICrewMemberRepository
    {
        private readonly AppDbContext _context;

        public CrewMemberRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Models.CrewMember>> GetAllAsync()
        {
            return await _context.CrewMembers.ToListAsync();
        }

        public async Task<Models.CrewMember?> GetByIdAsync(int id)
        {
            return await _context.CrewMembers.FindAsync(id);
        }

        public async Task AddAsync(Models.CrewMember member)
        {
            await _context.CrewMembers.AddAsync(member);
        }

        public void Update(Models.CrewMember member)
        {
            _context.CrewMembers.Update(member);
        }

        public void Delete(Models.CrewMember member)
        {
            _context.CrewMembers.Remove(member);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
