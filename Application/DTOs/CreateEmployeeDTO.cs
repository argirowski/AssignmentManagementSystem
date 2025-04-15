namespace Application.DTOs
{
    public class CreateEmployeeDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public List<CreateAssignmentDTO>? Assignments { get; set; } = new List<CreateAssignmentDTO>();
    }
}
