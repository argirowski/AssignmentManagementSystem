using System.Data;
using Microsoft.Data.SqlClient;
using Domain.Entities;
using Dapper;

namespace Persistence;

public class DatabaseSeeder
{
    private readonly IDbConnection _dbConnection;
    private readonly string _connectionString;

    public DatabaseSeeder(IDbConnection dbConnection, string connectionString)
    {
        _dbConnection = dbConnection;
        _connectionString = connectionString;
    }

    public async Task SeedAsync()
    {
        await EnsureDatabaseExistsAsync();

        const string createTableQuery = @"IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
            BEGIN
                CREATE TABLE Categories (
                    Id UNIQUEIDENTIFIER PRIMARY KEY,
                    Name NVARCHAR(255) NOT NULL
                );
            END";

        await _dbConnection.ExecuteAsync(createTableQuery);

        const string checkDataQuery = "SELECT COUNT(*) FROM Categories";
        var count = await _dbConnection.ExecuteScalarAsync<int>(checkDataQuery);

        if (count == 0)
        {
            var categories = new[]
            {
                new Category { Id = Guid.Parse("60c65f2a-8527-44c1-bd63-45b3aa528083"), Name = "Training & Onboarding" },
                new Category { Id = Guid.Parse("21686249-f55c-4aa4-8ac7-1134278c2878"), Name = "Bug Fixes" },
                new Category { Id = Guid.Parse("b02cbd6c-8f02-478d-9c61-b5d4569d65be"), Name = "Testing & QA" },
                new Category { Id = Guid.Parse("95460a92-3e16-45f8-a0e5-26941613bc50"), Name = "Research Tasks" },
                new Category { Id = Guid.Parse("d3cd6267-1351-41e2-8d4e-91c224c3c8c2"), Name = "Development Work" },
                new Category { Id = Guid.Parse("5c17b648-bf9e-4cd6-90a4-993f1cd8daf8"), Name = "Administrative Duties" }
            };

            const string insertQuery = "INSERT INTO Categories (Id, Name) VALUES (@Id, @Name)";
            await _dbConnection.ExecuteAsync(insertQuery, categories);
        }

        const string createStatusTableQuery = @"IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Statuses' AND xtype='U')
            BEGIN
                CREATE TABLE Statuses (
                    Id UNIQUEIDENTIFIER PRIMARY KEY,
                    Description NVARCHAR(255) NOT NULL
                );
            END";

        await _dbConnection.ExecuteAsync(createStatusTableQuery);

        const string checkStatusDataQuery = "SELECT COUNT(*) FROM Statuses";
        var statusCount = await _dbConnection.ExecuteScalarAsync<int>(checkStatusDataQuery);

        if (statusCount == 0)
        {
            var statuses = new[]
            {
                new { Id = Guid.Parse("138d3fce-a5f4-4c98-8dc4-a7384e9b0daf"), Description = "Pending" },
                new { Id = Guid.Parse("bd8c136e-63cc-481c-a99a-781cb907b3b7"), Description = "In Progress" },
                new { Id = Guid.Parse("a286b072-bcc3-45f8-99cc-5d673328950f"), Description = "Completed" },
                new { Id = Guid.Parse("fe9f742c-3381-42b8-a282-e8e8de5516b4"), Description = "On Hold" },
                new { Id = Guid.Parse("83b0c038-2d2d-4512-bd49-c7f13e9acc59"), Description = "Cancelled" }
            };

            const string insertStatusQuery = "INSERT INTO Statuses (Id, Description) VALUES (@Id, @Description)";
            await _dbConnection.ExecuteAsync(insertStatusQuery, statuses);
        }

        const string createEmployeesTableQuery = @"IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employees' AND xtype='U')
            BEGIN
                CREATE TABLE Employees (
                    Id UNIQUEIDENTIFIER PRIMARY KEY,
                    FullName NVARCHAR(255) NOT NULL,
                    Email NVARCHAR(255) NOT NULL,
                    DateJoined DATETIME NOT NULL
                );
            END";

        await _dbConnection.ExecuteAsync(createEmployeesTableQuery);

        const string checkEmployeesDataQuery = "SELECT COUNT(*) FROM Employees";
        var employeesCount = await _dbConnection.ExecuteScalarAsync<int>(checkEmployeesDataQuery);

        if (employeesCount == 0)
        {
            var employees = new[]
            {
                new { Id = Guid.Parse("9b232288-2afb-4771-a993-8547e4968e99"), FullName = "John Doe", Email = "john.doe@example.com", DateJoined = DateTime.UtcNow.AddDays(-100) },
                new { Id = Guid.Parse("93da5b27-6238-4015-8601-6ff334c11060"), FullName = "Jane Smith", Email = "jane.smith@example.com", DateJoined = DateTime.UtcNow.AddDays(-200) },
                new { Id = Guid.Parse("069f63f8-88a8-4077-a4af-cf9a321aabf3"), FullName = "Alice Johnson", Email = "alice.johnson@example.com", DateJoined = DateTime.UtcNow.AddDays(-300) },
                new { Id = Guid.Parse("d461a431-e7af-4c22-a96e-de0d93099fde"), FullName = "Bob Brown", Email = "bob.brown@example.com", DateJoined = DateTime.UtcNow.AddDays(-400) },
                new { Id = Guid.Parse("a53adac6-9472-4392-891a-135c939d28f2"), FullName = "Charlie Davis", Email = "charlie.davis@example.com", DateJoined = DateTime.UtcNow.AddDays(-500) }
            };

            const string insertEmployeesQuery = "INSERT INTO Employees (Id, FullName, Email, DateJoined) VALUES (@Id, @FullName, @Email, @DateJoined)";
            await _dbConnection.ExecuteAsync(insertEmployeesQuery, employees);
        }

        const string createAssignmentsTableQuery = @"IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Assignments' AND xtype='U')
            BEGIN
                CREATE TABLE Assignments (
                    Id UNIQUEIDENTIFIER PRIMARY KEY,
                    Title NVARCHAR(255) NOT NULL,
                    Description NVARCHAR(MAX) NOT NULL,
                    IsCompleted BIT NOT NULL,
                    CreatedAt DATETIME NOT NULL,
                    EmployeeId UNIQUEIDENTIFIER NOT NULL,
                    StatusId UNIQUEIDENTIFIER NOT NULL,
                    FOREIGN KEY (EmployeeId) REFERENCES Employees(Id),
                    FOREIGN KEY (StatusId) REFERENCES Statuses(Id)
                );
            END";

        await _dbConnection.ExecuteAsync(createAssignmentsTableQuery);

        const string createAssignmentCategoriesTableQuery = @"IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AssignmentCategories' AND xtype='U')
            BEGIN
                CREATE TABLE AssignmentCategories (
                    AssignmentId UNIQUEIDENTIFIER NOT NULL,
                    CategoryId UNIQUEIDENTIFIER NOT NULL,
                    PRIMARY KEY (AssignmentId, CategoryId),
                    FOREIGN KEY (AssignmentId) REFERENCES Assignments(Id),
                    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
                );
            END";

        await _dbConnection.ExecuteAsync(createAssignmentCategoriesTableQuery);

        const string checkAssignmentsDataQuery = "SELECT COUNT(*) FROM Assignments";
        var assignmentsCount = await _dbConnection.ExecuteScalarAsync<int>(checkAssignmentsDataQuery);

        if (assignmentsCount == 0)
        {
            var assignments = new[]
            {
                new { Id = Guid.Parse("e89ff54f-5ff6-4c68-88cd-af53336c55a0"), Title = "Task 1", Description = "Description for Task 1", IsCompleted = false, CreatedAt = DateTime.UtcNow.AddDays(-10), EmployeeId = Guid.Parse("9b232288-2afb-4771-a993-8547e4968e99"), StatusId = Guid.Parse("138d3fce-a5f4-4c98-8dc4-a7384e9b0daf") },
                new { Id = Guid.Parse("6e7ade97-d09b-4ea3-8380-95f3740e62e3"), Title = "Task 2", Description = "Description for Task 2", IsCompleted = true, CreatedAt = DateTime.UtcNow.AddDays(-5), EmployeeId = Guid.Parse("93da5b27-6238-4015-8601-6ff334c11060"), StatusId = Guid.Parse("bd8c136e-63cc-481c-a99a-781cb907b3b7") }
            };

            const string insertAssignmentsQuery = "INSERT INTO Assignments (Id, Title, Description, IsCompleted, CreatedAt, EmployeeId, StatusId) VALUES (@Id, @Title, @Description, @IsCompleted, @CreatedAt, @EmployeeId, @StatusId)";
            await _dbConnection.ExecuteAsync(insertAssignmentsQuery, assignments);

            var assignmentCategories = new[]
            {
                new { AssignmentId = Guid.Parse("e89ff54f-5ff6-4c68-88cd-af53336c55a0"), CategoryId = Guid.Parse("d3cd6267-1351-41e2-8d4e-91c224c3c8c2") },
                new { AssignmentId = Guid.Parse("6e7ade97-d09b-4ea3-8380-95f3740e62e3"), CategoryId = Guid.Parse("5c17b648-bf9e-4cd6-90a4-993f1cd8daf8") }
            };

            const string insertAssignmentCategoriesQuery = "INSERT INTO AssignmentCategories (AssignmentId, CategoryId) VALUES (@AssignmentId, @CategoryId)";
            await _dbConnection.ExecuteAsync(insertAssignmentCategoriesQuery, assignmentCategories);
        }
    }

    private async Task EnsureDatabaseExistsAsync()
    {
        var builder = new SqlConnectionStringBuilder(_connectionString);
        var databaseName = builder.InitialCatalog;

        // Set InitialCatalog to master to check/create the database
        builder.InitialCatalog = "AssignMentManagement";

        using var masterConnection = new SqlConnection(builder.ConnectionString);
        await masterConnection.OpenAsync();

        var checkDbQuery = $"IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '{databaseName}') CREATE DATABASE [{databaseName}]";
        await masterConnection.ExecuteAsync(checkDbQuery);
    }
}