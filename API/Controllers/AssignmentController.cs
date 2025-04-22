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
        public async Task<IActionResult> GetAll()
        {
            var assignments = await _assignmentService.GetAllAsync();
            return Ok(assignments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var assignment = await _assignmentService.GetByIdAsync(id);
            if (assignment == null) return NotFound();
            return Ok(assignment);
        }

        [HttpPost]
        public async Task<IActionResult> Create(AssignmentDTO assignmentDto)
        {
            var createdAssignment = await _assignmentService.CreateAsync(assignmentDto);
            return CreatedAtAction(nameof(GetById), new { id = createdAssignment.Id }, createdAssignment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, AssignmentDTO assignmentDto)
        {
            try
            {
                var updatedAssignment = await _assignmentService.UpdateAsync(id, assignmentDto);
                return Ok(updatedAssignment);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _assignmentService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }