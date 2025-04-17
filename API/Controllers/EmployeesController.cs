using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _employeeService.GetAllEmployeesAsync();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null)
            {
                return NotFound();
            }
            return Ok(employee);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateEmployeeDTO createEmployeeDTO)
        {
            var employeeDTO = await _employeeService.AddEmployeeAsync(createEmployeeDTO);
            return CreatedAtAction(nameof(GetById), new { id = employeeDTO.Id }, employeeDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, EmployeeDTO employeeDTO)
        {
            if (id != employeeDTO.Id)
            {
                return BadRequest(new { message = "The ID in the URL does not match the ID in the request body." });
            }

            try
            {
                await _employeeService.UpdateEmployeeAsync(employeeDTO);
                return NoContent(); // Return 204 No Content if successful
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Employee not found." }); // Return 404 if the employee does not exist
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the employee.", details = ex.Message }); // Return 500 for unexpected errors
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _employeeService.DeleteEmployeeAsync(id);
                return NoContent(); // Return 204 No Content if successful
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Employee not found." }); // Return 404 if the employee does not exist
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the employee.", details = ex.Message }); // Return 500 for unexpected errors
            }
        }
    }
}