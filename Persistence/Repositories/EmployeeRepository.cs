using Dapper;
using Domain.Entities;
using Domain.Interfaces;
using System.Data;

namespace Persistence.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
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
            const string sql = "INSERT INTO Employee (Id, Name, Email) VALUES (@Id, @Name, @Email)";
            await _dbConnection.ExecuteAsync(sql, entity, _dbTransaction);
        }

        public async Task AddAssignmentAsync(Assignment assignment)
        {
            const string sql = "INSERT INTO Assignment (Id, Title, Description, IsCompleted, CreatedAt, EmployeeId) VALUES (@Id, @Title, @Description, @IsCompleted, @CreatedAt, @EmployeeId)";
            await _dbConnection.ExecuteAsync(sql, assignment, _dbTransaction);
        }

        public async Task AddTagAsync(Tag tag)
        {
            const string sql = "INSERT INTO Tag (Id, Name) VALUES (@Id, @Name)";
            await _dbConnection.ExecuteAsync(sql, tag, _dbTransaction);
        }

        public async Task AddAssignmentTagAsync(Guid assignmentId, Guid tagId)
        {
            const string sql = "INSERT INTO AssignmentTag (AssignmentId, TagId) VALUES (@AssignmentId, @TagId)";
            await _dbConnection.ExecuteAsync(sql, new { AssignmentId = assignmentId, TagId = tagId }, _dbTransaction);
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            const string sql = @"
                SELECT e.*, a.*, t.*, at.*
                FROM Employee e
                LEFT JOIN Assignment a ON e.Id = a.EmployeeId
                LEFT JOIN AssignmentTag at ON a.Id = at.AssignmentId
                LEFT JOIN Tag t ON at.TagId = t.Id";

            var employeeDictionary = new Dictionary<Guid, Employee>();

            var result = await _dbConnection.QueryAsync<Employee, Assignment, Tag, Employee>(
                sql,
                (employee, assignment, tag) =>
                {
                    if (!employeeDictionary.TryGetValue(employee.Id, out var currentEmployee))
                    {
                        currentEmployee = employee;
                        currentEmployee.Assignments = new List<Assignment>();
                        employeeDictionary.Add(currentEmployee.Id, currentEmployee);
                    }

                    if (assignment != null)
                    {
                        var currentAssignment = currentEmployee.Assignments.FirstOrDefault(a => a.Id == assignment.Id);
                        if (currentAssignment == null)
                        {
                            currentAssignment = assignment;
                            currentAssignment.Tags = new List<Tag>();
                            currentEmployee.Assignments.Add(currentAssignment);
                        }

                        if (tag != null)
                        {
                            currentAssignment.Tags.Add(tag);
                        }
                    }

                    return currentEmployee;
                },
                splitOn: "Id,Id,Id",
                transaction: _dbTransaction);

            return result.Distinct().ToList();
        }

        public async Task<Employee?> GetByIdAsync(Guid id)
        {
            const string sql = @"
                SELECT e.*, a.*, t.*, at.*
                FROM Employee e
                LEFT JOIN Assignment a ON e.Id = a.EmployeeId
                LEFT JOIN AssignmentTag at ON a.Id = at.AssignmentId
                LEFT JOIN Tag t ON at.TagId = t.Id
                WHERE e.Id = @Id";

            var employeeDictionary = new Dictionary<Guid, Employee>();

            var result = await _dbConnection.QueryAsync<Employee, Assignment, Tag, Employee>(
                sql,
                (employee, assignment, tag) =>
                {
                    if (!employeeDictionary.TryGetValue(employee.Id, out var currentEmployee))
                    {
                        currentEmployee = employee;
                        currentEmployee.Assignments = new List<Assignment>();
                        employeeDictionary.Add(currentEmployee.Id, currentEmployee);
                    }

                    if (assignment != null)
                    {
                        var currentAssignment = currentEmployee.Assignments.FirstOrDefault(a => a.Id == assignment.Id);
                        if (currentAssignment == null)
                        {
                            currentAssignment = assignment;
                            currentAssignment.Tags = new List<Tag>();
                            currentEmployee.Assignments.Add(currentAssignment);
                        }

                        if (tag != null)
                        {
                            currentAssignment.Tags.Add(tag);
                        }
                    }

                    return currentEmployee;
                },
                new { Id = id },
                splitOn: "Id,Id,Id",
                transaction: _dbTransaction);

            return result.FirstOrDefault();
        }

        public async Task UpdateAsync(Employee entity)
        {
            const string sql = "UPDATE Employees SET Name = @Name, Email = @Email WHERE Id = @Id";
            await _dbConnection.ExecuteAsync(sql, entity, _dbTransaction);
        }

        public async Task DeleteAsync(Guid id)
        {
            const string sql = "DELETE FROM Employees WHERE Id = @Id";
            await _dbConnection.ExecuteAsync(sql, new { Id = id }, _dbTransaction);
        }
    }
}