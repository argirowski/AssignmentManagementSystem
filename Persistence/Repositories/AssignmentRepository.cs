using System.Data;
using Dapper;
using Domain.Entities;

public class AssignmentRepository : IAssignmentRepository
{
    private readonly IDbConnection _dbConnection;
    private readonly IDbTransaction? _transaction;

    public AssignmentRepository(IDbConnection dbConnection, IDbTransaction? transaction = null)
    {
        _dbConnection = dbConnection;
        _transaction = transaction;
    }

    public async Task<IEnumerable<Assignment>> GetAllAsync()
    {
        const string query = @"
            SELECT 
                a.Id, a.Title, a.Description, a.IsCompleted, a.CreatedAt, 
                e.Id, e.FullName, e.Email, e.DateJoined,
                s.Id, s.Description,
                c.Id, c.Name
            FROM Assignments a
            JOIN Employees e ON a.EmployeeId = e.Id
            JOIN Statuses s ON a.StatusId = s.Id
            LEFT JOIN AssignmentCategories ac ON a.Id = ac.AssignmentId
            LEFT JOIN Categories c ON ac.CategoryId = c.Id
            ORDER BY a.Id;";

        var assignmentDictionary = new Dictionary<Guid, Assignment>();

        var result = await _dbConnection.QueryAsync<Assignment, Employee, Status, Category, Assignment>(
            query,
            (assignment, employee, status, category) =>
            {
                if (!assignmentDictionary.TryGetValue(assignment.Id, out var existingAssignment))
                {
                    existingAssignment = assignment;
                    existingAssignment.Employee = employee;
                    existingAssignment.Status = status;
                    existingAssignment.AssignmentCategories = new List<AssignmentCategory>();
                    assignmentDictionary.Add(existingAssignment.Id, existingAssignment);
                }

                // Ensure valid category mapping and prevent null entries
                if (category is not null && category.Id != Guid.Empty)
                {
                    existingAssignment.AssignmentCategories.Add(new AssignmentCategory
                    {
                        AssignmentId = existingAssignment.Id,
                        CategoryId = category.Id,
                        Category = category
                    });
                }

                return existingAssignment;
            },
                null, // no parameters
                _transaction, // pass the transaction
                splitOn: "Id,Id,Id,Id"
        );

        return assignmentDictionary.Values;
    }

    public async Task<Assignment?> GetByIdAsync(Guid id)
    {
        const string query = @"SELECT a.Id, a.Title, a.Description, a.IsCompleted, a.CreatedAt, a.EmployeeId, a.StatusId, 
                          e.Id, e.FullName, e.Email, 
                          s.Id, s.Description, 
                          c.Id, c.Name
                          FROM Assignments a
                          JOIN Employees e ON a.EmployeeId = e.Id
                          JOIN Statuses s ON a.StatusId = s.Id
                          LEFT JOIN AssignmentCategories ac ON a.Id = ac.AssignmentId
                          LEFT JOIN Categories c ON ac.CategoryId = c.Id
                          WHERE a.Id = @Id";

        var assignmentDictionary = new Dictionary<Guid, Assignment>();

        var result = await _dbConnection.QueryAsync<Assignment, Employee, Status, Category, Assignment>(
            query,
            (assignment, employee, status, category) =>
            {
                if (!assignmentDictionary.TryGetValue(assignment.Id, out var assignmentEntry))
                {
                    assignmentEntry = assignment;
                    assignmentEntry.Employee = employee;
                    assignmentEntry.Status = status;
                    assignmentEntry.AssignmentCategories = new List<AssignmentCategory>();
                    assignmentDictionary.Add(assignment.Id, assignmentEntry);
                }

                if (category != null)
                {
                    assignmentEntry.AssignmentCategories.Add(new AssignmentCategory
                    {
                        AssignmentId = assignment.Id,
                        CategoryId = category.Id,
                        Category = category
                    });
                }

                return assignmentEntry;
            },
            new { Id = id },
            _transaction, // pass the transaction
            splitOn: "Id,Id,Id");

        return assignmentDictionary.Values.FirstOrDefault();
    }

    public async Task AddAsync(Assignment assignment)
    {
        const string assignmentQuery = "INSERT INTO Assignments (Id, Title, Description, EmployeeId, StatusId, IsCompleted, CreatedAt) VALUES (@Id, @Title, @Description, @EmployeeId, @StatusId, @IsCompleted, @CreatedAt)";
        const string categoryLinkQuery = "INSERT INTO AssignmentCategories (AssignmentId, CategoryId) VALUES (@AssignmentId, @CategoryId)";

        // Insert Assignment
        await _dbConnection.ExecuteAsync(assignmentQuery, new
        {
            assignment.Id,
            assignment.Title,
            assignment.Description,
            EmployeeId = assignment.Employee.Id,
            StatusId = assignment.Status.Id,
            IsCompleted = assignment.IsCompleted,
            CreatedAt = assignment.CreatedAt
        }, _transaction);

        // Link Categories
        foreach (var category in assignment.AssignmentCategories)
        {
            await _dbConnection.ExecuteAsync(categoryLinkQuery, new
            {
                AssignmentId = assignment.Id,
                CategoryId = category.CategoryId
            }, _transaction);
        }
    }

    public async Task UpdateAsync(Assignment assignment)
    {
        const string updateAssignmentQuery = "UPDATE Assignments SET Title = @Title, Description = @Description, EmployeeId = @EmployeeId, StatusId = @StatusId, IsCompleted = @IsCompleted WHERE Id = @Id";
        const string deleteAssignmentCategoriesQuery = "DELETE FROM AssignmentCategories WHERE AssignmentId = @Id";
        const string insertAssignmentCategoriesQuery = "INSERT INTO AssignmentCategories (AssignmentId, CategoryId) VALUES (@AssignmentId, @CategoryId)";

        await _dbConnection.ExecuteAsync(updateAssignmentQuery, new
        {
            assignment.Id,
            assignment.Title,
            assignment.Description,
            EmployeeId = assignment.Employee.Id,
            StatusId = assignment.Status.Id,
            assignment.IsCompleted
        }, _transaction);

        await _dbConnection.ExecuteAsync(deleteAssignmentCategoriesQuery, new { assignment.Id }, _transaction);

        foreach (var category in assignment.AssignmentCategories)
        {
            await _dbConnection.ExecuteAsync(insertAssignmentCategoriesQuery, new
            {
                AssignmentId = assignment.Id,
                CategoryId = category.CategoryId
            }, _transaction);
        }
    }

    public async Task RemoveAsync(Assignment assignment)
    {
        const string deleteAssignmentCategoriesQuery = "DELETE FROM AssignmentCategories WHERE AssignmentId = @Id";
        const string deleteAssignmentQuery = "DELETE FROM Assignments WHERE Id = @Id";

        await _dbConnection.ExecuteAsync(deleteAssignmentCategoriesQuery, new { assignment.Id }, _transaction);
        await _dbConnection.ExecuteAsync(deleteAssignmentQuery, new { assignment.Id }, _transaction);
    }
}