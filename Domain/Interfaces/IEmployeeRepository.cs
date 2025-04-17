using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IEmployeeRepository : IRepository<Employee>
    {
        Task AddAssignmentAsync(Assignment assignment);
        Task AddTagAsync(Tag tag);
        Task AddAssignmentTagAsync(Guid assignmentId, Guid tagId);
        Task<bool> AssignmentExistsAsync(string title);
        Task<bool> TagExistsAsync(string name);
    }
}
