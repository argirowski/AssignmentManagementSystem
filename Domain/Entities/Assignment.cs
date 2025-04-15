namespace Domain.Entities
{
    public class Assignment
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public bool IsCompleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key: Each assignment belongs to exactly one employee
        public Guid EmployeeId { get; set; }
        public Employee Employee { get; set; }

        // Many-to-Many: An assignment can have multiple tags
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}
