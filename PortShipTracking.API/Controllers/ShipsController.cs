using Microsoft.AspNetCore.Mvc;
using PortShipTracking.API.Models;
using PortShipTracking.API.Services.ShipService;

namespace PortShipTracking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShipsController : ControllerBase
{
    private readonly IShipService _shipService;

    public ShipsController(IShipService shipService)
    {
        _shipService = shipService;
    }

    // GET: api/ships
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ship>>> GetAllShips()
    {
        var ships = await _shipService.GetAllShipsAsync();
        return Ok(ships);
    }

    // GET: api/ships/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Ship>> GetShipById(int id)
    {
        var ship = await _shipService.GetShipByIdAsync(id);
        if (ship == null)
            return NotFound();

        return Ok(ship);
    }

    // POST: api/ships
    [HttpPost]
    public async Task<ActionResult<Ship>> CreateShip(Ship ship)
    {
        var created = await _shipService.CreateShipAsync(ship);
        return CreatedAtAction(nameof(GetShipById), new { id = created.ShipId }, created);
    }

    // PUT: api/ships/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateShip(int id, Ship ship)
    {
        var result = await _shipService.UpdateShipAsync(id, ship);
        if (!result)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/ships/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShip(int id)
    {
        var result = await _shipService.DeleteShipAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
    [HttpGet("search")]
    public async Task<ActionResult<List<Ship>>> Search(
    [FromQuery] int? shipId,
    [FromQuery] string? name,
    [FromQuery] string? imo,
    [FromQuery] string? type,
    [FromQuery] string? flag,
    [FromQuery] int? yearBuilt)
    {
        var result = await _shipService.SearchAsync(shipId, name, imo, type, flag, yearBuilt);
        return Ok(result);
    }
    [HttpGet("paged")]
    public async Task<ActionResult<IEnumerable<Ship>>> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var ships = await _shipService.GetPagedAsync(page, pageSize);
        return Ok(ships);
    }
    [HttpGet("count")]
    public async Task<ActionResult<int>> GetTotalCount()
    {
        int count = await _shipService.GetTotalCountAsync();
        return Ok(count);
    }
    [HttpGet("searchPaged")]
    public async Task<ActionResult<object>> SearchPaged(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] int? shipId = null,
    [FromQuery] string? name = null,
    [FromQuery] string? imo = null,
    [FromQuery] string? type = null,
    [FromQuery] string? flag = null,
    [FromQuery] int? yearBuilt = null)
    {
        var result = await _shipService.SearchPagedAsync(page, pageSize, shipId, name, imo, type, flag, yearBuilt);
        return Ok(result);
    }




}
