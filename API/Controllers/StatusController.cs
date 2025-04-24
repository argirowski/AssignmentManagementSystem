using Application.DTOs;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatusController : ControllerBase
    {
        private readonly IStatusService _statusService;

        public StatusController(IStatusService statusService)
        {
            _statusService = statusService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var statuses = await _statusService.GetAllStatusesAsync();
            return Ok(statuses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var status = await _statusService.GetStatusByIdAsync(id);
            if (status == null)
                return NotFound();

            return Ok(status);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateStatusDTO createStatusDTO)
        {
            await _statusService.CreateStatusAsync(createStatusDTO);
            return Ok(new { createStatusDTO.Description });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, StatusDTO statusDTO)
        {
            try
            {
                await _statusService.UpdateStatusAsync(id, statusDTO);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _statusService.DeleteStatusAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}