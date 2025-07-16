using PortShipTracking.API.Models;

namespace PortShipTracking.API.Repositories.CrewMemberRepository
{
    public interface ICrewMemberRepository
    {
        Task<List<Models.CrewMember>> GetAllAsync();
        Task<Models.CrewMember?> GetByIdAsync(int id);
        Task AddAsync(Models.CrewMember member);
        void Update(Models.CrewMember member);
        void Delete(Models.CrewMember member);
        Task SaveAsync();
    }
}
