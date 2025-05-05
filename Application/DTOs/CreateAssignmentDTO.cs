namespace Application.DTOs
{
    public class CreateAssignmentDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid EmployeeId { get; set; }
        public Guid StatusId { get; set; }
        public List<Guid> CategoryIds { get; set; }
        public bool IsCompleted { get; set; }
    }
}
