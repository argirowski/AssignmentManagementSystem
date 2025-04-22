using System.Data;
using Dapper;
using Domain.Entities;

public class EmployeeRepository : IEmployeeRepository
    {
        private readonly IDbConnection _dbConnection;

        public EmployeeRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            const string query = "SELECT * FROM Employees";
            return await _dbConnection.QueryAsync<Employee>(query);
        }

        public async Task<Employee> GetByIdAsync(Guid id)
        {
            const string query = "SELECT * FROM Employees WHERE Id = @Id";
            return await _dbConnection.QuerySingleOrDefaultAsync<Employee>(query, new { Id = id });
        }

        public async Task AddAsync(Employee employee)
        {
            const string query = "INSERT INTO Employees (Id, FullName, Email, DateJoined) VALUES (@Id, @FullName, @Email, @DateJoined)";
            await _dbConnection.ExecuteAsync(query, employee);
        }

        public void Update(Employee employee)
        {
            const string query = "UPDATE Employees SET FullName = @FullName, Email = @Email, DateJoined = @DateJoined WHERE Id = @Id";
            _dbConnection.Execute(query, employee);
        }

        public void Remove(Employee employee)
        {
            const string query = "DELETE FROM Employees WHERE Id = @Id";
            _dbConnection.Execute(query, new { employee.Id });
        }
    }