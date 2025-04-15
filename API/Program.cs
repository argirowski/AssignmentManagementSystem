using Dapper;
using Persistence;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Retrieve the initial connection string pointing to the master database
var masterConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Create a temporary DatabaseConnectionFactory to check and create the AssignmentManagement database
var tempDatabaseFactory = new DatabaseConnectionFactory(masterConnectionString);
using (var connection = tempDatabaseFactory.CreateConnection())
{
    connection.Open();

    // Check if the AssignmentManagement database exists, create it if it doesn't
    var createDatabaseQuery = @"
    IF DB_ID('AssignmentManagement') IS NULL
    BEGIN
        CREATE DATABASE AssignmentManagement;
    END;";
    connection.Execute(createDatabaseQuery);
}

// Update the connection string to point to the AssignmentManagement database
var assignmentManagementConnectionString = masterConnectionString.Replace("Database=master", "Database=AssignmentManagement");

// Register the updated DatabaseConnectionFactory with the AssignmentManagement connection string
builder.Services.AddSingleton(new DatabaseConnectionFactory(assignmentManagementConnectionString));
builder.Services.AddScoped<IDbConnection>(sp => sp.GetRequiredService<DatabaseConnectionFactory>().CreateConnection());

// Register the DatabaseSetup class for initialization
builder.Services.AddScoped<DatabaseSetup>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Perform database initialization (create tables and seed data)
using (var scope = app.Services.CreateScope())
{
    var databaseSetup = scope.ServiceProvider.GetRequiredService<DatabaseSetup>();
    await databaseSetup.InitializeDatabaseAsync();
}

app.Run();