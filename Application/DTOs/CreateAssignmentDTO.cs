public class CreateAssignmentDTO
{
    public string Title { get; set; }
    public string Description { get; set; }
    public Guid EmployeeId { get; set; } // ID of the employee assigned to the task
    public Guid StatusId { get; set; }   // ID of the status for the assignment
    public List<Guid> CategoryIds { get; set; } // List of category IDs to link to the assignment
    public bool IsCompleted { get; set; }
}