using Dapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using System.Data;

namespace Persistence.Repositories
{
    public class StatusRepository : IStatusRepository
    {
        private readonly IDbConnection _connection;
        private readonly IDbTransaction? _transaction;

        public StatusRepository(IDbConnection dbConnection, IDbTransaction? transaction = null)
        {
            _connection = dbConnection;
            _transaction = transaction;
        }

        public async Task<Status?> GetByIdAsync(Guid id)
        {
            const string query = "SELECT * FROM Statuses WHERE Id = @Id";
            return await _connection.QuerySingleOrDefaultAsync<Status>(query, new { Id = id }, _transaction);
        }

        public async Task<IEnumerable<Status>> GetAllAsync()
        {
            const string query = "SELECT * FROM Statuses";
            return await _connection.QueryAsync<Status>(query, null, _transaction);
        }

        public async Task AddAsync(Status status)
        {
            const string query = "INSERT INTO Statuses (Id, Description) VALUES (@Id, @Description)";
            await _connection.ExecuteAsync(query, status, _transaction);
        }

        public async Task UpdateAsync(Status status)
        {
            const string query = "UPDATE Statuses SET Description = @Description WHERE Id = @Id";
            await _connection.ExecuteAsync(query, status, _transaction);
        }

        public async Task DeleteAsync(Guid id)
        {
            const string query = "DELETE FROM Statuses WHERE Id = @Id";
            await _connection.ExecuteAsync(query, new { Id = id }, _transaction);
        }

        public async Task<bool> IsStatusLinkedToAssignmentsAsync(Guid statusId)
        {
            const string query = "SELECT COUNT(1) FROM Assignments WHERE StatusId = @StatusId";
            var count = await _connection.ExecuteScalarAsync<int>(query, new { StatusId = statusId }, _transaction);
            return count > 0;
        }

        public async Task<Status?> GetByDescriptionAsync(string description)
        {
            var query = "SELECT * FROM Statuses WHERE Description = @Description";
            return await _connection.QueryFirstOrDefaultAsync<Status>(query, new { Description = description }, _transaction);
        }
    }
}