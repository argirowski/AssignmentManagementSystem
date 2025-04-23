namespace Application.DTOs
{
    public class AssignmentDTO
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }

        public EmployeeDTO Employee { get; set; }
        public StatusDTO Status { get; set; }
        public List<CategoryDTO> Categories { get; set; } = new List<CategoryDTO>();

    }
}