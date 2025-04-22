namespace Domain.Entities
{
    public class Status
    {
        public Guid Id { get; set; }

        public required string Description { get; set; }
    }
}
