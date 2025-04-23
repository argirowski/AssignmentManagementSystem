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
                splitOn: "Id,Id,Id,Id"
        );

        return assignmentDictionary.Values;
    }

    public async Task<Assignment> GetByIdAsync(Guid id)
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
            splitOn: "Id,Id,Id");

        return assignmentDictionary.Values.FirstOrDefault();
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