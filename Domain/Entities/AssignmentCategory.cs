namespace Domain.Entities
{
    public class AssignmentCategory
    {
        public Guid AssignmentId { get; set; }
        public Assignment Assignment { get; set; } = null!;

        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
    }
}