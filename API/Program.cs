using Persistence;
using Domain.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using Application.Mapping;
using Application.Services.Interfaces;
using Application.Services.Implementations;
using Persistence.UnitOfWork;
using Application.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IDbConnection>(sp =>
{
    var connectionString = builder.Configuration.GetConnectionString("AppConnectionString");
    return new System.Data.SqlClient.SqlConnection(connectionString);
});

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IStatusService, StatusService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();
builder.Services.AddAutoMapper(typeof(MappingProfiles));

// Register FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CategoryDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateCategoryDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<StatusDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateStatusDTOValidator>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Add custom exception handling middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var configuration = services.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("AppConnectionString");

    using var connection = new SqlConnection(connectionString);
    var seeder = new DatabaseSeeder(connection, connectionString);
    await seeder.SeedAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();