using Microsoft.AspNetCore.Mvc;
using PortShipTracking.API.Models;
using PortShipTracking.API.Services.CrewMemberService;

namespace PortShipTracking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CrewMembersController : ControllerBase
{
    private readonly ICrewMemberService _crewService;

    public CrewMembersController(ICrewMemberService crewService)
    {
        _crewService = crewService;
    }

    // GET: api/crewmembers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CrewMember>>> GetAll()
    {
        var crew = await _crewService.GetAllAsync();
        return Ok(crew);
    }

    // GET: api/crewmembers/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CrewMember>> GetById(int id)
    {
        var member = await _crewService.GetByIdAsync(id);
        if (member == null)
            return NotFound();

        return Ok(member);
    }

    // POST: api/crewmembers
    [HttpPost]
    public async Task<ActionResult<CrewMember>> Create(CrewMember member)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _crewService.CreateAsync(member);
        return CreatedAtAction(nameof(GetById), new { id = created.CrewId }, created);
    }

    // PUT: api/crewmembers/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CrewMember member)
    {
        var result = await _crewService.UpdateAsync(id, member);
        if (!result)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/crewmembers/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _crewService.DeleteAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
    [HttpGet("searchPaged")]
    public async Task<ActionResult<object>> SearchPaged(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] int? crewId = null,
    [FromQuery] string? firstName = null,
    [FromQuery] string? lastName = null,
    [FromQuery] string? email = null,
    [FromQuery] string? phoneNumber = null,
    [FromQuery] string? role = null)
    {
        var result = await _crewService.SearchPagedAsync(page, pageSize, crewId, firstName, lastName, email, phoneNumber, role);
        return Ok(result);
    }
}
