namespace Application.DTOs
{
    public class CreateAssignmentDTO
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public Guid EmployeeId { get; set; }
        public Guid StatusId { get; set; }
        public required List<Guid> CategoryIds { get; set; }
        public bool IsCompleted { get; set; }
    }
}
