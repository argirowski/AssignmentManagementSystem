using System.Data;
using Dapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;

namespace Persistence.Repositories;

public class StatusRepository : IStatusRepository
{
    private readonly IDbConnection _dbConnection;

    public StatusRepository (IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Status?> GetByIdAsync(Guid id)
    {
        const string query = "SELECT * FROM Statuses WHERE Id = @Id";
        return await _dbConnection.QuerySingleOrDefaultAsync<Status>(query, new { Id = id });
    }

    public async Task<IEnumerable<Status>> GetAllAsync()
    {
        const string query = "SELECT * FROM Statuses";
        return await _dbConnection.QueryAsync<Status>(query);
    }

    public async Task AddAsync(Status status)
    {
        const string query = "INSERT INTO Statuses (Id, Description) VALUES (@Id, @Description)";
        await _dbConnection.ExecuteAsync(query, status);
    }

    public async Task UpdateAsync(Status status)
    {
        const string query = "UPDATE Statuses SET Description = @Description WHERE Id = @Id";
        await _dbConnection.ExecuteAsync(query, status);
    }

    public async Task DeleteAsync(Guid id)
    {
        const string query = "DELETE FROM Statuses WHERE Id = @Id";
        await _dbConnection.ExecuteAsync(query, new { Id = id });
    }
}