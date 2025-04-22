using Application.DTOs;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDTO>> GetAllEmployeesAsync();
    Task<EmployeeDTO> GetEmployeeByIdAsync(Guid id);
    Task<EmployeeDTO> CreateEmployeeAsync(CreateEmployeeDTO createEmployeeDTO);
    Task<EmployeeDTO> UpdateEmployeeAsync(Guid id, EmployeeDTO employeeDto);
    Task DeleteEmployeeAsync(Guid id);
}