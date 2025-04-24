using Domain.Entities;

public interface IEmployeeRepository
{
    Task<IEnumerable<Employee>> GetAllAsync();
    Task<Employee> GetByIdAsync(Guid id);
    Task AddAsync(Employee employee);
    void Update(Employee employee);
    void Remove(Employee employee);
    Task<bool> IsEmployeeLinkedToAssignmentsAsync(Guid categoryId);
}