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

        public UnitOfWork(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
            if (_dbConnection.State == ConnectionState.Closed)
            {
                _dbConnection.Open();
            }
        }

        public ICategoryRepository Categories => _categoryRepository ??= new CategoryRepository(_dbConnection);
        public IStatusRepository Statuses => _statusRepository ??= new StatusRepository(_dbConnection);
        public IEmployeeRepository Employees => _employeeRepository ??= new EmployeeRepository(_dbConnection);
        public IAssignmentRepository Assignments => _assignmentRepository ??= new AssignmentRepository(_dbConnection);

        public Task<int> CompleteAsync()
        {
            // Assuming the use of a transaction, commit it here.
            if (_dbConnection.State == ConnectionState.Open)
            {
                // Commit transaction logic if applicable
                return Task.FromResult(1); // Return a dummy value for now
            }

            return Task.FromResult(0);
        }

        public void Dispose()
        {
            _dbConnection?.Dispose();
        }
    }
}