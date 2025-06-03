namespace Application.DTOs
{
    public class AssignmentDTO
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }

        public required EmployeeDTO Employee { get; set; }
        public required StatusDTO Status { get; set; }
        public required List<CategoryDTO> Categories { get; set; }

    }
}