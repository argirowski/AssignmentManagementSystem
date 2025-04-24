using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id);
    Task<IEnumerable<Category>> GetAllAsync();
    Task AddAsync(Category category);
    Task UpdateAsync(Category category);
    Task DeleteAsync(Guid id);
    Task<bool> IsCategoryLinkedToAssignmentsAsync(Guid categoryId);
    Task<Category?> GetByNameAsync(string name);
}