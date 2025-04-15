namespace Domain.Entities
{
    public class Employee
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        // Navigation property for the one-to-many relationship
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
