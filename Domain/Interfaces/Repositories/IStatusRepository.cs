using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IStatusRepository
{
    Task<Status?> GetByIdAsync(Guid id);
    Task<IEnumerable<Status>> GetAllAsync();
    Task AddAsync(Status category);
    Task UpdateAsync(Status category);
    Task DeleteAsync(Guid id);
    Task<bool> IsStatusLinkedToAssignmentsAsync(Guid categoryId);
}