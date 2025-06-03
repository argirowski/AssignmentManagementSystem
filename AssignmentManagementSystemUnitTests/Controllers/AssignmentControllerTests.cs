using Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Moq;

public class AssignmentControllerTests
{
    private readonly Mock<IAssignmentService> _mockAssignmentService;
    private readonly AssignmentController _controller;

    public AssignmentControllerTests()
    {
        _mockAssignmentService = new Mock<IAssignmentService>();
        _controller = new AssignmentController(_mockAssignmentService.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkWithAssignments()
    {
        var assignments = new List<AssignmentDTO> {
            new AssignmentDTO {
                Id = Guid.NewGuid(),
                Title = "Test",
                Description = "Desc",
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                Employee = new EmployeeDTO { Id = Guid.NewGuid(), FullName = "Emp", Email = "emp@test.com" },
                Status = new StatusDTO { Id = Guid.NewGuid(), Description = "Status" },
                Categories = new List<CategoryDTO> { new CategoryDTO { Id = Guid.NewGuid(), Name = "Cat" } }
            }
        };
        _mockAssignmentService.Setup(s => s.GetAllAsync()).ReturnsAsync(assignments);

        var result = await _controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(assignments, okResult.Value);
    }

    [Fact]
    public async Task GetById_ReturnsOkWithAssignment()
    {
        var id = Guid.NewGuid();
        var assignment = new AssignmentDTO
        {
            Id = id,
            Title = "Test",
            Description = "Desc",
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            Employee = new EmployeeDTO { Id = Guid.NewGuid(), FullName = "Emp", Email = "emp@test.com" },
            Status = new StatusDTO { Id = Guid.NewGuid(), Description = "Status" },
            Categories = new List<CategoryDTO> { new CategoryDTO { Id = Guid.NewGuid(), Name = "Cat" } }
        };
        _mockAssignmentService.Setup(s => s.GetByIdAsync(id)).ReturnsAsync(assignment);

        var result = await _controller.GetById(id);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(assignment, okResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtActionWithAssignment()
    {
        var createDto = new CreateAssignmentDTO
        {
            Title = "Test",
            Description = "Desc",
            EmployeeId = Guid.NewGuid(),
            StatusId = Guid.NewGuid(),
            CategoryIds = new List<Guid> { Guid.NewGuid() },
            IsCompleted = false
        };
        var createdAssignment = new AssignmentDTO
        {
            Id = Guid.NewGuid(),
            Title = createDto.Title,
            Description = createDto.Description,
            IsCompleted = createDto.IsCompleted,
            CreatedAt = DateTime.UtcNow,
            Employee = new EmployeeDTO { Id = createDto.EmployeeId, FullName = "Emp", Email = "emp@test.com" },
            Status = new StatusDTO { Id = createDto.StatusId, Description = "Status" },
            Categories = new List<CategoryDTO> { new CategoryDTO { Id = createDto.CategoryIds[0], Name = "Cat" } }
        };
        _mockAssignmentService.Setup(s => s.CreateAsync(createDto)).ReturnsAsync(createdAssignment);

        var result = await _controller.Create(createDto);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(createdAssignment, createdAtActionResult.Value);
        Assert.Equal(nameof(_controller.GetById), createdAtActionResult.ActionName);
    }

    [Fact]
    public async Task Update_ReturnsOkWithUpdatedAssignment()
    {
        var id = Guid.NewGuid();
        var updateDto = new CreateAssignmentDTO
        {
            Title = "Updated",
            Description = "Desc",
            EmployeeId = Guid.NewGuid(),
            StatusId = Guid.NewGuid(),
            CategoryIds = new List<Guid> { Guid.NewGuid() },
            IsCompleted = true
        };
        var updatedAssignment = new AssignmentDTO
        {
            Id = id,
            Title = updateDto.Title,
            Description = updateDto.Description,
            IsCompleted = updateDto.IsCompleted,
            CreatedAt = DateTime.UtcNow,
            Employee = new EmployeeDTO { Id = updateDto.EmployeeId, FullName = "Emp", Email = "emp@test.com" },
            Status = new StatusDTO { Id = updateDto.StatusId, Description = "Status" },
            Categories = new List<CategoryDTO> { new CategoryDTO { Id = updateDto.CategoryIds[0], Name = "Cat" } }
        };
        _mockAssignmentService.Setup(s => s.UpdateAsync(id, updateDto)).ReturnsAsync(updatedAssignment);

        var result = await _controller.Update(id, updateDto);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(updatedAssignment, okResult.Value);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent()
    {
        var id = Guid.NewGuid();
        _mockAssignmentService.Setup(s => s.DeleteAsync(id)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(id);

        Assert.IsType<NoContentResult>(result);
    }
}
