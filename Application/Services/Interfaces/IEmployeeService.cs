using Application.DTOs;

public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDTO>> GetAllAsync();
        Task<EmployeeDTO> GetByIdAsync(Guid id);
        Task<EmployeeDTO> CreateAsync(EmployeeDTO employeeDto);
        Task<EmployeeDTO> UpdateAsync(Guid id, EmployeeDTO employeeDto);
        Task DeleteAsync(Guid id);
    }