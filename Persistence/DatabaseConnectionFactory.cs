using Microsoft.Data.SqlClient;
using System.Data;

namespace Persistence
{
    public class DatabaseConnectionFactory
    {
        private readonly string _connectionString;

        public DatabaseConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IDbConnection CreateConnection()
        {
            // Create and return the database connection (e.g., SqlConnection for SQL Server)
            return new SqlConnection(_connectionString);
        }
    }
}