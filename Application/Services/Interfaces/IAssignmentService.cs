using Application.DTOs;

public interface IAssignmentService
{
    Task<IEnumerable<AssignmentDTO>> GetAllAsync();
    Task<AssignmentDTO> GetByIdAsync(Guid id);
    Task<AssignmentDTO> CreateAsync(CreateAssignmentDTO createAssignmentDTO);
    Task<AssignmentDTO> UpdateAsync(Guid id, AssignmentDTO assignmentDto);
    Task DeleteAsync(Guid id);
}