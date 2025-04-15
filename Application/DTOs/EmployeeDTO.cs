namespace Application.DTOs
{
    public class EmployeeDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public List<AssignmentDTO>? Assignments { get; set; } = new List<AssignmentDTO>();
    }
}
