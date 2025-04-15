using Dapper;
using Domain.Entities;
using Domain.Interfaces;
using System.Data;

namespace Persistence.Repositories
{
    public class EmployeeRepository : IRepository<Employee>
    {
        private readonly IDbConnection _dbConnection;
        private readonly IDbTransaction _dbTransaction;

        public EmployeeRepository(IDbConnection dbConnection, IDbTransaction dbTransaction)
        {
            _dbConnection = dbConnection;
            _dbTransaction = dbTransaction;
        }

        public async Task AddAsync(Employee entity)
        {
            const string sql = "INSERT INTO Employees (Id, Name, Email) VALUES (@Id, @Name, @Email)";
            await _dbConnection.ExecuteAsync(sql, entity, _dbTransaction);
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            const string sql = "SELECT * FROM Employee";
            return await _dbConnection.QueryAsync<Employee>(sql, transaction: _dbTransaction);
        }

        public async Task<Employee?> GetByIdAsync(Guid id)
        {
            const string sql = "SELECT * FROM Employee WHERE Id = @Id";
            return await _dbConnection.QuerySingleOrDefaultAsync<Employee>(sql, new { Id = id }, _dbTransaction);
        }

        public async Task UpdateAsync(Employee entity)
        {
            const string sql = "UPDATE Employee SET Name = @Name, Email = @Email WHERE Id = @Id";
            await _dbConnection.ExecuteAsync(sql, entity, _dbTransaction);
        }

        public async Task DeleteAsync(Guid id)
        {
            const string sql = "DELETE FROM Employee WHERE Id = @Id";
            await _dbConnection.ExecuteAsync(sql, new { Id = id }, _dbTransaction);
        }
    }
}