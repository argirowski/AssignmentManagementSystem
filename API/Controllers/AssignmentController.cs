using Application.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AssignmentController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public AssignmentController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AssignmentDTO>>> GetAll()
    {
        var assignments = await _assignmentService.GetAllAsync();
        return Ok(assignments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AssignmentDTO>> GetById(Guid id)
    {
        var assignment = await _assignmentService.GetByIdAsync(id);
        return Ok(assignment);
    }

    [HttpPost]
    public async Task<ActionResult<AssignmentDTO>> Create(CreateAssignmentDTO createAssignmentDto)
    {
        var createdAssignment = await _assignmentService.CreateAsync(createAssignmentDto);
        return CreatedAtAction(nameof(GetById), new { id = createdAssignment.Id }, createdAssignment);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AssignmentDTO>> Update(Guid id, CreateAssignmentDTO updateAssignmentDTO)
    {
        var updatedAssignment = await _assignmentService.UpdateAsync(id, updateAssignmentDTO);
        return Ok(updatedAssignment);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _assignmentService.DeleteAsync(id);
        return NoContent();
    }
}