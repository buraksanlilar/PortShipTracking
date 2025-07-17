using PortShipTracking.API.Models;

namespace PortShipTracking.API.Services.CrewMemberService
{
    public interface ICrewMemberService
    {
        Task<List<Models.CrewMember>> GetAllAsync();
        Task<Models.CrewMember?> GetByIdAsync(int id);
        Task<Models.CrewMember> CreateAsync(Models.CrewMember member);
        Task<bool> UpdateAsync(int id, Models.CrewMember member);
        Task<bool> DeleteAsync(int id);
    }
}
