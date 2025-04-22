using System.Data;
using Dapper;
using Domain.Entities;

public class AssignmentRepository : IAssignmentRepository
    {
        private readonly IDbConnection _dbConnection;

        public AssignmentRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<IEnumerable<Assignment>> GetAllAsync()
        {
            const string query = "SELECT * FROM Assignments";
            return await _dbConnection.QueryAsync<Assignment>(query);
        }

        public async Task<Assignment> GetByIdAsync(Guid id)
        {
            const string query = "SELECT * FROM Assignments WHERE Id = @Id";
            return await _dbConnection.QuerySingleOrDefaultAsync<Assignment>(query, new { Id = id });
        }

        public async Task AddAsync(Assignment assignment)
        {
            const string query = "INSERT INTO Assignments (Id, Title, Description, EmployeeId, StatusId) VALUES (@Id, @Title, @Description, @EmployeeId, @StatusId)";
            await _dbConnection.ExecuteAsync(query, assignment);
        }

        public void Update(Assignment assignment)
        {
            const string query = "UPDATE Assignments SET Title = @Title, Description = @Description, EmployeeId = @EmployeeId, StatusId = @StatusId WHERE Id = @Id";
            _dbConnection.Execute(query, assignment);
        }

        public void Remove(Assignment assignment)
        {
            const string query = "DELETE FROM Assignments WHERE Id = @Id";
            _dbConnection.Execute(query, new { assignment.Id });
        }
    }