using Dapper;
using Domain.Entities;
using System.Data;

namespace Persistence.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly IDbConnection _connection;

        public EmployeeRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            const string query = "SELECT * FROM Employees";
            return await _connection.QueryAsync<Employee>(query);
        }

        public async Task<Employee?> GetByIdAsync(Guid id)
        {
            const string query = "SELECT * FROM Employees WHERE Id = @Id";
            return await _connection.QuerySingleOrDefaultAsync<Employee>(query, new { Id = id });
        }

        public async Task AddAsync(Employee employee)
        {
            const string query = "INSERT INTO Employees (Id, FullName, Email, DateJoined) VALUES (@Id, @FullName, @Email, @DateJoined)";
            await _connection.ExecuteAsync(query, employee);
        }

        public async Task UpdateAsync(Employee employee)
        {
            const string query = "UPDATE Employees SET FullName = @FullName, Email = @Email, DateJoined = @DateJoined WHERE Id = @Id";
            await _connection.ExecuteAsync(query, employee);
        }

        public async Task RemoveAsync(Employee employee)
        {
            const string query = "DELETE FROM Employees WHERE Id = @Id";
            await _connection.ExecuteAsync(query, new { employee.Id });
        }

        public async Task<bool> IsEmployeeLinkedToAssignmentsAsync(Guid employeeId)
        {
            const string query = "SELECT COUNT(1) FROM Assignments WHERE EmployeeId = @EmployeeId";
            var count = await _connection.ExecuteScalarAsync<int>(query, new { EmployeeId = employeeId });
            return count > 0;
        }

        public async Task<Employee?> GetByFullNameAsync(string fullName)
        {
            var query = "SELECT * FROM Employees WHERE FullName = @FullName";
            return await _connection.QueryFirstOrDefaultAsync<Employee>(query, new { FullName = fullName });
        }
    }
}