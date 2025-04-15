using Dapper;
using System.Data;

namespace Persistence
{
    public class DatabaseSetup
    {
        private readonly IDbConnection _connection;

        public DatabaseSetup(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task InitializeDatabaseAsync()
        {
            // Create the database if it doesn't exist
            var createDatabaseQuery = @"
            IF DB_ID('AssignmentManagement') IS NULL
            BEGIN
                CREATE DATABASE AssignmentManagement;
            END";
            await _connection.ExecuteAsync(createDatabaseQuery);

            // Switch to the AssignmentManagement database
            await ChangeDatabaseAsync("AssignmentManagement");

            // Create the tables if they don't exist
            await CreateTablesAsync();

            // Seed the data if tables are empty
            await SeedDataAsync();
        }

        private async Task ChangeDatabaseAsync(string databaseName)
        {
            if (_connection.State != ConnectionState.Open)
            {
                _connection.Open();
            }

            var changeDatabaseQuery = $"USE {databaseName}";
            await _connection.ExecuteAsync(changeDatabaseQuery);
        }

        private async Task CreateTablesAsync()
        {
            var createTablesQuery = @"
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'Employee' AND xtype = 'U')
            BEGIN
                CREATE TABLE [Employee] (
                    Id UNIQUEIDENTIFIER PRIMARY KEY,
                    Name NVARCHAR(100) NOT NULL,
                    Email NVARCHAR(100) NOT NULL
                );
            END;

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'Assignment' AND xtype = 'U')
            BEGIN
                CREATE TABLE [Assignment] (
                    Id UNIQUEIDENTIFIER PRIMARY KEY,
                    Title NVARCHAR(100) NOT NULL,
                    Description NVARCHAR(500),
                    IsCompleted BIT NOT NULL,
                    CreatedAt DATETIME NOT NULL,
                    EmployeeId UNIQUEIDENTIFIER NOT NULL,
                    FOREIGN KEY (EmployeeId) REFERENCES [Employee](Id)
                );
            END;

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'Tag' AND xtype = 'U')
            BEGIN
                CREATE TABLE [Tag] (
                    Id UNIQUEIDENTIFIER PRIMARY KEY,
                    Name NVARCHAR(100) NOT NULL
                );
            END;

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'AssignmentTag' AND xtype = 'U')
            BEGIN
                CREATE TABLE [AssignmentTag] (
                    AssignmentId UNIQUEIDENTIFIER NOT NULL,
                    TagId UNIQUEIDENTIFIER NOT NULL,
                    PRIMARY KEY (AssignmentId, TagId),
                    FOREIGN KEY (AssignmentId) REFERENCES [Assignment](Id),
                    FOREIGN KEY (TagId) REFERENCES [Tag](Id)
                );
            END;";
            await _connection.ExecuteAsync(createTablesQuery);
        }

        private async Task SeedDataAsync()
        {
            var seedEmployeesQuery = @"
            IF NOT EXISTS (SELECT 1 FROM [Employee])
            BEGIN
                INSERT INTO [Employee] (Id, Name, Email) VALUES
                (NEWID(), 'Alice', 'alice@example.com'),
                (NEWID(), 'Bob', 'bob@example.com'),
                (NEWID(), 'Charlie', 'charlie@example.com');
            END";
            await _connection.ExecuteAsync(seedEmployeesQuery);

            var seedAssignmentsQuery = @"
            IF NOT EXISTS (SELECT 1 FROM [Assignment])
            BEGIN
                INSERT INTO [Assignment] (Id, Title, Description, IsCompleted, CreatedAt, EmployeeId) VALUES
                (NEWID(), 'Assignment 1', 'Description of Assignment 1', 0, GETUTCDATE(), (SELECT TOP 1 Id FROM [Employee] WHERE Name = 'Alice')),
                (NEWID(), 'Assignment 2', 'Description of Assignment 2', 0, GETUTCDATE(), (SELECT TOP 1 Id FROM [Employee] WHERE Name = 'Alice')),
                (NEWID(), 'Assignment 3', 'Description of Assignment 3', 1, GETUTCDATE(), (SELECT TOP 1 Id FROM [Employee] WHERE Name = 'Bob')),
                (NEWID(), 'Assignment 4', 'Description of Assignment 4', 0, GETUTCDATE(), (SELECT TOP 1 Id FROM [Employee] WHERE Name = 'Charlie'));
            END";
            await _connection.ExecuteAsync(seedAssignmentsQuery);

            var seedTagsQuery = @"
            IF NOT EXISTS (SELECT 1 FROM [Tag])
            BEGIN
                INSERT INTO [Tag] (Id, Name) VALUES
                (NEWID(), 'Urgent'),
                (NEWID(), 'Important'),
                (NEWID(), 'Optional');
            END";
            await _connection.ExecuteAsync(seedTagsQuery);

            var seedAssignmentTagsQuery = @"
            IF NOT EXISTS (SELECT 1 FROM [AssignmentTag])
            BEGIN
                INSERT INTO [AssignmentTag] (AssignmentId, TagId) VALUES
                ((SELECT TOP 1 Id FROM [Assignment] WHERE Title = 'Assignment 1'), (SELECT TOP 1 Id FROM [Tag] WHERE Name = 'Urgent')),
                ((SELECT TOP 1 Id FROM [Assignment] WHERE Title = 'Assignment 1'), (SELECT TOP 1 Id FROM [Tag] WHERE Name = 'Important')),
                ((SELECT TOP 1 Id FROM [Assignment] WHERE Title = 'Assignment 2'), (SELECT TOP 1 Id FROM [Tag] WHERE Name = 'Urgent')),
                ((SELECT TOP 1 Id FROM [Assignment] WHERE Title = 'Assignment 3'), (SELECT TOP 1 Id FROM [Tag] WHERE Name = 'Optional')),
                ((SELECT TOP 1 Id FROM [Assignment] WHERE Title = 'Assignment 4'), (SELECT TOP 1 Id FROM [Tag] WHERE Name = 'Important')),
                ((SELECT TOP 1 Id FROM [Assignment] WHERE Title = 'Assignment 4'), (SELECT TOP 1 Id FROM [Tag] WHERE Name = 'Optional'));
            END";
            await _connection.ExecuteAsync(seedAssignmentTagsQuery);
        }
    }
}