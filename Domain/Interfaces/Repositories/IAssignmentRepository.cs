using Domain.Entities;

public interface IAssignmentRepository
    {
        Task<IEnumerable<Assignment>> GetAllAsync();
        Task<Assignment> GetByIdAsync(Guid id);
        Task AddAsync(Assignment assignment);
        void Update(Assignment assignment);
        void Remove(Assignment assignment);
    }