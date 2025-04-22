namespace Domain.Entities
{
    public class Assignment
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;
        public Guid StatusId { get; set; }
        public Status Status { get; set; } = null!;
        public ICollection<AssignmentCategory> AssignmentCategories { get; set; } = new List<AssignmentCategory>();
    }
}