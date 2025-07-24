using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.CrewMemberRepository
{
    public interface ICrewMemberRepository
    {
        Task<List<CrewMember>> GetAllAsync();
        Task<CrewMember?> GetByIdAsync(int id);
        Task AddAsync(CrewMember member);
        void Update(CrewMember member);
        void Delete(CrewMember member);
        Task<object> SearchPagedAsync(int page, int pageSize, int? crewId, string? firstName, string? lastName, string? email, string? phoneNumber, string? role);
        Task SaveAsync();
    }
}
