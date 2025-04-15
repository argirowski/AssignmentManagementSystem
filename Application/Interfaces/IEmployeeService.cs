using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDTO>> GetAllEmployeesAsync();
        Task<EmployeeDTO?> GetEmployeeByIdAsync(Guid id);
        Task<EmployeeDTO> AddEmployeeAsync(CreateEmployeeDTO createEmployeeDTO);
        Task UpdateEmployeeAsync(EmployeeDTO employeeDto);
        Task DeleteEmployeeAsync(Guid id);
    }
}
