namespace Domain.Entities
{
    public class Tag
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        // Many-to-Many: A tag can belong to multiple assignments
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
