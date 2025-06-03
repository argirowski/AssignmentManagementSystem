using Domain.Entities;

public interface IAssignmentRepository
{
    Task<IEnumerable<Assignment>> GetAllAsync();
    Task<Assignment?> GetByIdAsync(Guid id);
    Task AddAsync(Assignment assignment);
    Task UpdateAsync(Assignment assignment);
    Task RemoveAsync(Assignment assignment);
}