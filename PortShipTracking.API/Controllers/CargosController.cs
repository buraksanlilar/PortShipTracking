using Microsoft.AspNetCore.Mvc;
using PortShipTracking.API.Dtos.CargoDto;
using PortShipTracking.API.Models;
using PortShipTracking.API.Services.CargoService;
//cargo
namespace PortShipTracking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CargosController : ControllerBase
{
    private readonly ICargoService _cargoService;

    public CargosController(ICargoService cargoService)
    {
        _cargoService = cargoService;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var cargos = await _cargoService.GetAllAsync();
        return Ok(cargos);
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cargo = await _cargoService.GetByIdAsync(id);
        if (cargo == null) return NotFound();

        return Ok(cargo);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCargoDto dto)
    {
        var cargo = new Cargo
        {
            ShipId = dto.ShipId,
            Description = dto.Description,
            WeightTon = dto.WeightTon,
            CargoType = dto.CargoType
        };

        var created = await _cargoService.CreateAsync(cargo);
        return CreatedAtAction(nameof(GetById), new { id = created.CargoId }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateCargoDto dto)
    {
        var updatedCargo = new Cargo
        {
            CargoId = id,
            ShipId = dto.ShipId,
            Description = dto.Description,
            WeightTon = dto.WeightTon,
            CargoType = dto.CargoType
        };

        var success = await _cargoService.UpdateAsync(id, updatedCargo);
        if (!success) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _cargoService.DeleteAsync(id);
        if (!success) return NotFound();

        return NoContent();
    }
    [HttpPost("searchPaged")]
    public async Task<IActionResult> SearchPaged([FromBody] SearchCargoDto dto)
    {
        var result = await _cargoService.SearchPagedAsync(dto);
        return Ok(result);
    }

}
