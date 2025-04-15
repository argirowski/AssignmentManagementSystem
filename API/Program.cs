using Application.Interfaces;
using Application.Mapping;
using Application.Services;
using Dapper;
using Domain.Entities;
using Domain.Interfaces;
using Persistence;
using Persistence.Repositories;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// Register repositories and unit of work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IEmployeeRepository>(sp =>
{
    var unitOfWork = sp.GetRequiredService<IUnitOfWork>();
    return unitOfWork.EmployeeRepository;
});

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Register application services
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

// Perform database initialization (create tables and seed data)
using (var scope = app.Services.CreateScope())
{
    var databaseSetup = scope.ServiceProvider.GetRequiredService<DatabaseSetup>();
    await databaseSetup.InitializeDatabaseAsync();
}

app.Run();