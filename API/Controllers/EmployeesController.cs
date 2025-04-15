using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public EmployeesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee([FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            employee.Id = Guid.NewGuid();
            await _unitOfWork.EmployeeRepository.AddAsync(employee);
            await _unitOfWork.CommitAsync();

            return CreatedAtAction(nameof(AddEmployee), new { id = employee.Id }, employee);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _unitOfWork.EmployeeRepository.GetAllAsync();
            return Ok(employees);
        }

        [HttpGet("id")]
        public async Task<IActionResult> GetEmployeeById(Guid id)
        {
            var employee = await _unitOfWork.EmployeeRepository.GetByIdAsync(id);

            if (employee == null)
            {
                return NotFound($"Employee with ID {id} was not found.");
            }

            return Ok(employee);
        }

        [HttpPut("id")]
        public async Task<IActionResult> UpdateEmployee(Guid id, [FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingEmployee = await _unitOfWork.EmployeeRepository.GetByIdAsync(id);
            if (existingEmployee == null)
            {
                return NotFound($"Employee with ID {id} was not found.");
            }

            // Update fields
            existingEmployee.Name = employee.Name;
            existingEmployee.Email = employee.Email;

            await _unitOfWork.EmployeeRepository.UpdateAsync(existingEmployee);
            await _unitOfWork.CommitAsync();

            return Ok(existingEmployee);
        }

        [HttpDelete("id")]
        public async Task<IActionResult> DeleteEmployee(Guid id)
        {
            var existingEmployee = await _unitOfWork.EmployeeRepository.GetByIdAsync(id);
            if (existingEmployee == null)
            {
                return NotFound($"Employee with ID {id} was not found.");
            }

            await _unitOfWork.EmployeeRepository.DeleteAsync(id);
            await _unitOfWork.CommitAsync();

            return NoContent(); // 204 No Content response
        }
    }
}
