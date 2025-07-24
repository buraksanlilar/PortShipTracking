using Microsoft.AspNetCore.Mvc;
using PortShipTracking.API.Models;
using PortShipTracking.API.Services.ShipCrewAssignmentService;
using PortShipTracking.API.Dtos.ShipCrewAssignmentDto;

namespace PortShipTracking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShipCrewAssignmentsController : ControllerBase
{
    private readonly IShipCrewAssignmentService _service;

    public ShipCrewAssignmentsController(IShipCrewAssignmentService service)
    {
        _service = service;
    }

    // GET: api/shipcrewassignments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShipCrewAssignment>>> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    // GET: api/shipcrewassignments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ShipCrewAssignment>> GetById(int id)
    {
        var assignment = await _service.GetByIdAsync(id);
        if (assignment == null)
            return NotFound();

        return Ok(assignment);
    }

    // POST: api/shipcrewassignments
    [HttpPost]
    public async Task<ActionResult<ShipCrewAssignment>> Create(CreateShipCrewAssignmentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var assignment = new ShipCrewAssignment
        {
            ShipId = dto.ShipId,
            CrewId = dto.CrewId,
            AssignmentDate = dto.AssignmentDate
        };

        var created = await _service.CreateAsync(assignment);
        return CreatedAtAction(nameof(GetById), new { id = created.AssignmentId }, created);
    }

    // PUT: api/shipcrewassignments/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateShipCrewAssignmentDto dto)
    {
        var updated = new ShipCrewAssignment
        {
            AssignmentId = id,
            ShipId = dto.ShipId,
            CrewId = dto.CrewId,
            AssignmentDate = dto.AssignmentDate
        };

        var result = await _service.UpdateAsync(id, updated);
        if (!result)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/shipcrewassignments/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
    [HttpGet("searchPaged")]
    public async Task<IActionResult> SearchPaged(
     [FromQuery] int page,
     [FromQuery] int pageSize,
     [FromQuery] int? assignmentId,
     [FromQuery] int? shipId,
     [FromQuery] int? crewId,
     [FromQuery] DateTime? assignmentDate
     )
    {
        var result = await _service.SearchPagedAsync(
            page,
            pageSize,
            assignmentId,
            shipId,
            crewId,
            assignmentDate
            );

        return Ok(result);
    }
}
