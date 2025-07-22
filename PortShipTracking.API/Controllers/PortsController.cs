using Microsoft.AspNetCore.Mvc;
using PortShipTracking.API.Models;
using PortShipTracking.API.Services.PortService;

namespace PortShipTracking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PortsController : ControllerBase
{
    private readonly IPortService _portService;

    public PortsController(IPortService portService)
    {
        _portService = portService;
    }

    // GET: api/ports
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Port>>> GetAllPorts()
    {
        var ports = await _portService.GetAllPortsAsync();
        return Ok(ports);
    }

    // GET: api/ports/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Port>> GetPortById(int id)
    {
        var port = await _portService.GetPortByIdAsync(id);
        if (port == null)
            return NotFound();

        return Ok(port);
    }

    // POST: api/ports
    [HttpPost]
    public async Task<ActionResult<Port>> CreatePort(Port port)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _portService.CreatePortAsync(port);
        return CreatedAtAction(nameof(GetPortById), new { id = created.PortId }, created);
    }

    // PUT: api/ports/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePort(int id, Port port)
    {
        var result = await _portService.UpdatePortAsync(id, port);
        if (!result)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/ports/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePort(int id)
    {
        var result = await _portService.DeletePortAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
    [HttpGet("searchPaged")]
    public async Task<ActionResult<object>> SearchPaged(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] int? portId = null,
    [FromQuery] string? name = null,
    [FromQuery] string? country = null,
    [FromQuery] string? city = null
    )
    {
        var result = await _portService.SearchPagedAsync(page, pageSize, portId, name, country, city);
        return Ok(result);
    }

}
