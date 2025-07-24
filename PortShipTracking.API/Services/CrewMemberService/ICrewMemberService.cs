using PortShipTracking.API.Models;

namespace PortShipTracking.API.Services.CrewMemberService
{
    public interface ICrewMemberService
    {
        Task<List<CrewMember>> GetAllAsync();
        Task<CrewMember?> GetByIdAsync(int id);
        Task<CrewMember> CreateAsync(Models.CrewMember member);
        Task<bool> UpdateAsync(int id, Models.CrewMember member);
        Task<bool> DeleteAsync(int id);
        Task<object> SearchPagedAsync(int page, int pageSize, int? crewId, string? firstName, string? lastName, string? email, string? phoneNumber, string? role);
    }
}
