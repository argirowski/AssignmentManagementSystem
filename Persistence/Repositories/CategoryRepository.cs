using System.Data;
using Dapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;

namespace Persistence.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly IDbConnection _dbConnection;

    public CategoryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        const string query = "SELECT * FROM Categories WHERE Id = @Id";
        return await _dbConnection.QuerySingleOrDefaultAsync<Category>(query, new { Id = id });
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        const string query = "SELECT * FROM Categories";
        return await _dbConnection.QueryAsync<Category>(query);
    }

    public async Task AddAsync(Category category)
    {
        const string query = "INSERT INTO Categories (Id, Name) VALUES (@Id, @Name)";
        await _dbConnection.ExecuteAsync(query, category);
    }

    public async Task UpdateAsync(Category category)
    {
        const string query = "UPDATE Categories SET Name = @Name WHERE Id = @Id";
        await _dbConnection.ExecuteAsync(query, category);
    }

    public async Task DeleteAsync(Guid id)
    {
        const string query = "DELETE FROM Categories WHERE Id = @Id";
        await _dbConnection.ExecuteAsync(query, new { Id = id });
    }

    public async Task<bool> IsCategoryLinkedToAssignmentsAsync(Guid categoryId)
    {
        const string query = "SELECT COUNT(1) FROM AssignmentCategories WHERE CategoryId = @CategoryId";
        var count = await _dbConnection.ExecuteScalarAsync<int>(query, new { CategoryId = categoryId });
        return count > 0;
    }
}