namespace Application.DTOs
{
    public class AssignmentDTO
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public Guid EmployeeId { get; set; }
        public Guid StatusId { get; set; }
        public ICollection<Guid> CategoryIds { get; set; } = new List<Guid>();
    }
}