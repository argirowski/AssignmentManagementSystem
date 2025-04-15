namespace Application.DTOs
{
    public class AssignmentDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TagDTO> Tags { get; set; } = new List<TagDTO>();
    }
}
