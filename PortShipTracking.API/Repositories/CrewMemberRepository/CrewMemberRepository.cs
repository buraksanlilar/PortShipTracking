using Microsoft.AspNetCore.Identity;
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

        public async Task<List<CrewMember>> GetAllAsync()
        {
            return await _context.CrewMembers.ToListAsync();
        }

        public async Task<CrewMember?> GetByIdAsync(int id)
        {
            return await _context.CrewMembers.FindAsync(id);
        }

        public async Task AddAsync(CrewMember member)
        {
            await _context.CrewMembers.AddAsync(member);
        }

        public void Update(CrewMember member)
        {
            _context.CrewMembers.Update(member);
        }

        public void Delete(CrewMember member)
        {
            _context.CrewMembers.Remove(member);
        }
        public async Task<object> SearchPagedAsync(int page, int pageSize, int? crewId, string? firstName, string? lastName, string? email, string? phoneNumber, string? role)
        {
            var query = _context.CrewMembers.AsQueryable();

            if (crewId.HasValue)
                query = query.Where(s => s.CrewId == crewId.Value);

            if (!string.IsNullOrWhiteSpace(firstName))
                query = query.Where(s => s.FirstName != null && EF.Functions.Like(s.FirstName, $"%{firstName}%"));

            if (!string.IsNullOrWhiteSpace(lastName))
                query = query.Where(s => s.LastName != null && EF.Functions.Like(s.LastName, $"%{lastName}%"));

            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(s => s.Email != null && EF.Functions.Like(s.Email, $"%{email}%"));

            if (!string.IsNullOrWhiteSpace(phoneNumber))
                query = query.Where(s => s.PhoneNumber != null && EF.Functions.Like(s.PhoneNumber, $"%{phoneNumber}%"));

            if (!string.IsNullOrWhiteSpace(role))
                query = query.Where(s => s.Role != null && EF.Functions.Like(s.Role, $"%{role}%"));

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(s => s.CrewId)
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
