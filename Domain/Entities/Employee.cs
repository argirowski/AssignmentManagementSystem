namespace Domain.Entities
{
    public class Employee
    {
        public Guid Id { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public DateTime DateJoined { get; set; } = DateTime.UtcNow;
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
