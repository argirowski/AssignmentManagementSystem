using Domain.Entities;

public interface IEmployeeRepository
{
    Task<IEnumerable<Employee>> GetAllAsync();
    Task<Employee?> GetByIdAsync(Guid id);
    Task AddAsync(Employee employee);
    Task UpdateAsync(Employee employee);
    Task RemoveAsync(Employee employee);
    Task<bool> IsEmployeeLinkedToAssignmentsAsync(Guid categoryId);
    Task<Employee?> GetByFullNameAsync(string fullName);
}