using Microsoft.AspNetCore.Mvc;
using PortShipTracking.API.Models;
using PortShipTracking.API.Services.ShipVisitService;
using PortShipTracking.API.Dtos.ShipVisitDto;

namespace PortShipTracking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShipVisitsController : ControllerBase
{
    private readonly IShipVisitService _visitService;

    public ShipVisitsController(IShipVisitService visitService)
    {
        _visitService = visitService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShipVisit>>> GetAll()
    {
        var visits = await _visitService.GetAllAsync();
        return Ok(visits);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ShipVisit>> GetById(int id)
    {
        var visit = await _visitService.GetByIdAsync(id);
        if (visit == null)
            return NotFound();

        return Ok(visit);
    }

    [HttpPost]
    public async Task<ActionResult<ShipVisit>> Create(CreateShipVisitDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var visit = new ShipVisit
        {
            ShipId = dto.ShipId,
            PortId = dto.PortId,
            ArrivalDate = dto.ArrivalDate,
            DepartureDate = dto.DepartureDate,
            Purpose = dto.Purpose
        };

        var created = await _visitService.CreateAsync(visit);
        return CreatedAtAction(nameof(GetById), new { id = created.VisitId }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateShipVisitDto dto)
    {
        var updatedVisit = new ShipVisit
        {
            VisitId = id,
            ShipId = dto.ShipId,
            PortId = dto.PortId,
            ArrivalDate = dto.ArrivalDate,
            DepartureDate = dto.DepartureDate,
            Purpose = dto.Purpose
        };

        var result = await _visitService.UpdateAsync(id, updatedVisit);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _visitService.DeleteAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
