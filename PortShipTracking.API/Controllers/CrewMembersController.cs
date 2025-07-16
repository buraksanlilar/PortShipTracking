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
}
