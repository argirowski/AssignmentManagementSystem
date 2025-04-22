using Domain.Interfaces.Repositories;

namespace Domain.Interfaces;

public interface IUnitOfWork
{
    ICategoryRepository Categories { get; }
    IStatusRepository Statuses { get; }
    IEmployeeRepository Employees { get; }
    Task<int> CompleteAsync();
}