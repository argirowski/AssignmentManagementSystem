using System.Data;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using Persistence.Repositories;

namespace Persistence.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IDbConnection _dbConnection;
        private ICategoryRepository? _categoryRepository;
        private IStatusRepository? _statusRepository;
        private IEmployeeRepository? _employeeRepository;
        private IAssignmentRepository? _assignmentRepository;
        private IDbTransaction? _transaction;

        public UnitOfWork(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
            if (_dbConnection.State == ConnectionState.Closed)
            {
                _dbConnection.Open();
            }
            _transaction = _dbConnection.BeginTransaction();
        }

        public ICategoryRepository Categories => _categoryRepository ??= new CategoryRepository(_dbConnection, _transaction);
        public IStatusRepository Statuses => _statusRepository ??= new StatusRepository(_dbConnection, _transaction);
        public IEmployeeRepository Employees => _employeeRepository ??= new EmployeeRepository(_dbConnection, _transaction);
        public IAssignmentRepository Assignments => _assignmentRepository ??= new AssignmentRepository(_dbConnection, _transaction);

        public async Task<int> CompleteAsync()
        {
            if (_transaction != null)
            {
                _transaction.Commit();
                _transaction.Dispose();
                _transaction = null;
                return 1;
            }
            return 0;
        }

        public void Dispose()
        {
            if (_transaction != null)
            {
                _transaction.Rollback();
                _transaction.Dispose();
                _transaction = null;
            }
            _dbConnection?.Dispose();
        }
    }
}