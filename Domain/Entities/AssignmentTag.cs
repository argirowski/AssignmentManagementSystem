namespace Domain.Entities
{
    public class AssignmentTag
    {
        public Guid AssignmentId { get; set; }
        public Assignment Assignment { get; set; }
        public Guid TagId { get; set; }
        public Tag Tag { get; set; }
    }
}

