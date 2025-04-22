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
                new Category { Id = Guid.NewGuid(), Name = "Training & Onboarding" },
                new Category { Id = Guid.NewGuid(), Name = "Bug Fixes" },
                new Category { Id = Guid.NewGuid(), Name = "Testing & QA" },
                new Category { Id = Guid.NewGuid(), Name = "Research Tasks" },
                new Category { Id = Guid.NewGuid(), Name = "Development Work" },
                new Category { Id = Guid.NewGuid(), Name = "Administrative Duties" }
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
                new { Id = Guid.NewGuid(), Description = "Pending" },
                new { Id = Guid.NewGuid(), Description = "In Progress" },
                new { Id = Guid.NewGuid(), Description = "Completed" },
                new { Id = Guid.NewGuid(), Description = "On Hold" },
                new { Id = Guid.NewGuid(), Description = "Cancelled" }
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
                new { Id = Guid.NewGuid(), FullName = "John Doe", Email = "john.doe@example.com", DateJoined = DateTime.UtcNow.AddDays(-100) },
                new { Id = Guid.NewGuid(), FullName = "Jane Smith", Email = "jane.smith@example.com", DateJoined = DateTime.UtcNow.AddDays(-200) },
                new { Id = Guid.NewGuid(), FullName = "Alice Johnson", Email = "alice.johnson@example.com", DateJoined = DateTime.UtcNow.AddDays(-300) },
                new { Id = Guid.NewGuid(), FullName = "Bob Brown", Email = "bob.brown@example.com", DateJoined = DateTime.UtcNow.AddDays(-400) },
                new { Id = Guid.NewGuid(), FullName = "Charlie Davis", Email = "charlie.davis@example.com", DateJoined = DateTime.UtcNow.AddDays(-500) }
            };

            const string insertEmployeesQuery = "INSERT INTO Employees (Id, FullName, Email, DateJoined) VALUES (@Id, @FullName, @Email, @DateJoined)";
            await _dbConnection.ExecuteAsync(insertEmployeesQuery, employees);
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