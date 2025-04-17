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

        public async Task<bool> AssignmentExistsAsync(string title)
        {
            const string sql = "SELECT COUNT(1) FROM Assignment WHERE Title = @Title AND EmployeeId = @EmployeeId";
            return await _dbConnection.ExecuteScalarAsync<bool>(sql, new { Title = title }, _dbTransaction);
        }

        public async Task<bool> TagExistsAsync(string name)
        {
            const string sql = "SELECT COUNT(1) FROM Tag WHERE Name = @Name";
            return await _dbConnection.ExecuteScalarAsync<bool>(sql, new { Name = name }, _dbTransaction);
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
            // Update the employee's details
            const string updateEmployeeSql = "UPDATE Employee SET Name = @Name, Email = @Email WHERE Id = @Id";
            await _dbConnection.ExecuteAsync(updateEmployeeSql, entity, _dbTransaction);

            // Delete existing assignments and their relationships for the employee
            const string deleteAssignmentTagsSql = @"
                DELETE at
                FROM AssignmentTag at
                INNER JOIN Assignment a ON at.AssignmentId = a.Id
                WHERE a.EmployeeId = @EmployeeId";
            await _dbConnection.ExecuteAsync(deleteAssignmentTagsSql, new { EmployeeId = entity.Id }, _dbTransaction);

            const string deleteAssignmentsSql = "DELETE FROM Assignment WHERE EmployeeId = @EmployeeId";
            await _dbConnection.ExecuteAsync(deleteAssignmentsSql, new { EmployeeId = entity.Id }, _dbTransaction);

            // Re-insert updated assignments and their relationships
            foreach (var assignment in entity.Assignments)
            {
                const string insertAssignmentSql = "INSERT INTO Assignment (Id, Title, Description, IsCompleted, CreatedAt, EmployeeId) VALUES (@Id, @Title, @Description, @IsCompleted, @CreatedAt, @EmployeeId)";
                await _dbConnection.ExecuteAsync(insertAssignmentSql, assignment, _dbTransaction);

                foreach (var tag in assignment.Tags)
                {
                    // Ensure the tag exists in the Tag table
                    const string insertTagSql = "IF NOT EXISTS (SELECT 1 FROM Tag WHERE Id = @Id) INSERT INTO Tag (Id, Name) VALUES (@Id, @Name)";
                    await _dbConnection.ExecuteAsync(insertTagSql, tag, _dbTransaction);

                    // Insert the relationship into the AssignmentTag table
                    const string insertAssignmentTagSql = "INSERT INTO AssignmentTag (AssignmentId, TagId) VALUES (@AssignmentId, @TagId)";
                    await _dbConnection.ExecuteAsync(insertAssignmentTagSql, new { AssignmentId = assignment.Id, TagId = tag.Id }, _dbTransaction);
                }
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            // Delete related assignment-tag relationships
            const string deleteAssignmentTagsSql = @"
                DELETE at
                FROM AssignmentTag at
                INNER JOIN Assignment a ON at.AssignmentId = a.Id
                WHERE a.EmployeeId = @EmployeeId";
            await _dbConnection.ExecuteAsync(deleteAssignmentTagsSql, new { EmployeeId = id }, _dbTransaction);

            // Delete related assignments
            const string deleteAssignmentsSql = "DELETE FROM Assignment WHERE EmployeeId = @EmployeeId";
            await _dbConnection.ExecuteAsync(deleteAssignmentsSql, new { EmployeeId = id }, _dbTransaction);

            // Delete the employee
            const string deleteEmployeeSql = "DELETE FROM Employee WHERE Id = @Id";
            await _dbConnection.ExecuteAsync(deleteEmployeeSql, new { Id = id }, _dbTransaction);
        }
    }
}