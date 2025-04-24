using Application.DTOs;
using Microsoft.AspNetCore.Mvc;

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
        return Ok(employee);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateEmployeeDTO createEmployeeDTO)
    {
        var createdEmployee = await _employeeService.CreateEmployeeAsync(createEmployeeDTO);
        return CreatedAtAction(nameof(GetById), new { id = createdEmployee.Id }, createdEmployee);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, EmployeeDTO employeeDTO)
    {
        var updatedEmployee = await _employeeService.UpdateEmployeeAsync(id, employeeDTO);
        return Ok(updatedEmployee);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _employeeService.DeleteEmployeeAsync(id);
        return NoContent();
    }
}