using PortShipTracking.API.Models;
using PortShipTracking.API.Repositories.CrewMemberRepository;

namespace PortShipTracking.API.Services.CrewMemberService;


public class CrewMemberService : ICrewMemberService
{
    private readonly ICrewMemberRepository _repository;

    public CrewMemberService(ICrewMemberRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<CrewMember>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<CrewMember?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<CrewMember> CreateAsync(CrewMember member)
    {
        await _repository.AddAsync(member);
        await _repository.SaveAsync();
        return member;
    }

    public async Task<bool> UpdateAsync(int id, CrewMember member)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return false;

        existing.FirstName = member.FirstName;
        existing.LastName = member.LastName;
        existing.Email = member.Email;
        existing.PhoneNumber = member.PhoneNumber;
        existing.Role = member.Role;

        await _repository.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return false;

        _repository.Delete(existing);
        await _repository.SaveAsync();
        return true;
    }
    public async Task<object> SearchPagedAsync(int page, int pageSize, int? crewId, string? firstName, string? lastName, string? email, string? phoneNumber, string? role)
    {
        return await _repository.SearchPagedAsync(page, pageSize, crewId, firstName, lastName, email, phoneNumber, role);
    }
}

