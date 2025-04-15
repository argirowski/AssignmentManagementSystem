using Domain.Entities;
using Domain.Interfaces;
using System.Data;

namespace Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction _dbTransaction;

        private IEmployeeRepository? _employeeRepository;
        private bool _disposed;

        public UnitOfWork(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
            _dbConnection.Open();
            _dbTransaction = _dbConnection.BeginTransaction();
        }

        public IEmployeeRepository EmployeeRepository
        {
            get
            {
                return _employeeRepository ??= new EmployeeRepository(_dbConnection, _dbTransaction);
            }
        }

        public async Task CommitAsync()
        {
            try
            {
                _dbTransaction.Commit();
            }
            catch
            {
                _dbTransaction.Rollback();
                throw;
            }
            finally
            {
                Dispose();
            }
        }

        public void Dispose()
        {
            if (!_disposed)
            {
                _dbTransaction.Dispose();
                _dbConnection.Dispose();
                _disposed = true;
            }
        }
    }
}