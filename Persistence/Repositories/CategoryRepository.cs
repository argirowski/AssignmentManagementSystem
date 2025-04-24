using Dapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using System.Data;

namespace Persistence.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IDbConnection _connection;

        public CategoryRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<Category?> GetByIdAsync(Guid id)
        {
            const string query = "SELECT * FROM Categories WHERE Id = @Id";
            return await _connection.QuerySingleOrDefaultAsync<Category>(query, new { Id = id });
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            const string query = "SELECT * FROM Categories";
            return await _connection.QueryAsync<Category>(query);
        }

        public async Task AddAsync(Category category)
        {
            const string query = "INSERT INTO Categories (Id, Name) VALUES (@Id, @Name)";
            await _connection.ExecuteAsync(query, category);
        }

        public async Task UpdateAsync(Category category)
        {
            const string query = "UPDATE Categories SET Name = @Name WHERE Id = @Id";
            await _connection.ExecuteAsync(query, category);
        }

        public async Task DeleteAsync(Guid id)
        {
            const string query = "DELETE FROM Categories WHERE Id = @Id";
            await _connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> IsCategoryLinkedToAssignmentsAsync(Guid categoryId)
        {
            const string query = "SELECT COUNT(1) FROM AssignmentCategories WHERE CategoryId = @CategoryId";
            var count = await _connection.ExecuteScalarAsync<int>(query, new { CategoryId = categoryId });
            return count > 0;
        }

        public async Task<Category?> GetByNameAsync(string name)
        {
            var query = "SELECT * FROM Categories WHERE Name = @Name";
            return await _connection.QueryFirstOrDefaultAsync<Category>(query, new { Name = name });
        }
    }
}