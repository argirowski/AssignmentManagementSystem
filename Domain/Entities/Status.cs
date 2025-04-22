namespace Domain.Entities
{
    public class Status
    {
        public Guid Id { get; set; }

        public required string Description { get; set; }

        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
