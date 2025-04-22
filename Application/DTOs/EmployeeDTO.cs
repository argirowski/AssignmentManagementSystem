namespace Application.DTOs
{
    public class EmployeeDTO
    {
        public Guid Id { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
    }
}
