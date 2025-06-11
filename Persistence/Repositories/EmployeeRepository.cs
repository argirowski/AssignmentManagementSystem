using Dapper;
using Domain.Entities;
using System.Data;

namespace Persistence.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly IDbConnection _dbConnection;
        private readonly IDbTransaction? _transaction;

        public EmployeeRepository(IDbConnection dbConnection, IDbTransaction? transaction = null)
        {
            _dbConnection = dbConnection;
            _transaction = transaction;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            const string query = "SELECT * FROM Employees";
            return await _dbConnection.QueryAsync<Employee>(query, null, _transaction);
        }

        public async Task<Employee?> GetByIdAsync(Guid id)
        {
            const string query = "SELECT * FROM Employees WHERE Id = @Id";
            return await _dbConnection.QuerySingleOrDefaultAsync<Employee>(query, new { Id = id }, _transaction);
        }

        public async Task AddAsync(Employee employee)
        {
            const string query = "INSERT INTO Employees (Id, FullName, Email, DateJoined) VALUES (@Id, @FullName, @Email, @DateJoined)";
            await _dbConnection.ExecuteAsync(query, employee, _transaction);
        }

        public async Task UpdateAsync(Employee employee)
        {
            const string query = "UPDATE Employees SET FullName = @FullName, Email = @Email, DateJoined = @DateJoined WHERE Id = @Id";
            await _dbConnection.ExecuteAsync(query, employee, _transaction);
        }

        public async Task RemoveAsync(Employee employee)
        {
            const string query = "DELETE FROM Employees WHERE Id = @Id";
            await _dbConnection.ExecuteAsync(query, new { employee.Id }, _transaction);
        }

        public async Task<bool> IsEmployeeLinkedToAssignmentsAsync(Guid employeeId)
        {
            const string query = "SELECT COUNT(1) FROM Assignments WHERE EmployeeId = @EmployeeId";
            var count = await _dbConnection.ExecuteScalarAsync<int>(query, new { EmployeeId = employeeId }, _transaction);
            return count > 0;
        }

        public async Task<Employee?> GetByFullNameAsync(string fullName)
        {
            var query = "SELECT * FROM Employees WHERE FullName = @FullName";
            return await _dbConnection.QueryFirstOrDefaultAsync<Employee>(query, new { FullName = fullName }, _transaction);
        }
    }
}