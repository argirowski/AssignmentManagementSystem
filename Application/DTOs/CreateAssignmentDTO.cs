namespace Application.DTOs
{
    public class CreateAssignmentDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public List<TagDTO> Tags { get; set; } = new List<TagDTO>();
    }
}
