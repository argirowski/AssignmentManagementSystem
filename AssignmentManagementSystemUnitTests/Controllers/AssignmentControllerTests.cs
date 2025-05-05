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
    public async Task GetAll_ReturnsOkResult_WithListOfAssignments()
    {
        // Arrange
        var assignments = new List<AssignmentDTO>
        {
            new AssignmentDTO
            {
                Id = Guid.NewGuid(),
                Title = "Test Assignment",
                Description = "Sample Description",
                Employee = new EmployeeDTO { Id = Guid.NewGuid(), FullName = "John Doe", Email = "johndoe@example.com" },
                Status = new StatusDTO { Id = Guid.NewGuid(), Description = "In Progress" }
            }
        };
        _mockAssignmentService.Setup(s => s.GetAllAsync()).ReturnsAsync(assignments);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(assignments, okResult.Value);
    }

    [Fact]
    public async Task GetById_ReturnsOkResult_WithAssignment()
    {
        // Arrange
        var assignmentId = Guid.NewGuid();
        var assignment = new AssignmentDTO
        {
            Id = assignmentId,
            Title = "Test Assignment",
            Description = "Sample Description",
            Employee = new EmployeeDTO { Id = Guid.NewGuid(), FullName = "Jane Doe", Email = "janedoe@example.com" },
            Status = new StatusDTO { Id = Guid.NewGuid(), Description = "Completed" }
        };
        _mockAssignmentService.Setup(s => s.GetByIdAsync(assignmentId)).ReturnsAsync(assignment);

        // Act
        var result = await _controller.GetById(assignmentId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(assignment, okResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtActionResult_WithCreatedAssignment()
    {
        // Arrange
        var createDto = new CreateAssignmentDTO { Title = "New Assignment", Description = "Sample Description" };
        var createdAssignment = new AssignmentDTO
        {
            Id = Guid.NewGuid(),
            Title = createDto.Title,
            Description = createDto.Description,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            Employee = new EmployeeDTO { Id = Guid.NewGuid(), FullName = "John Doe", Email = "johndoe@example.com" },
            Status = new StatusDTO { Id = Guid.NewGuid(), Description = "In Progress" }
        };
        _mockAssignmentService.Setup(s => s.CreateAsync(createDto)).ReturnsAsync(createdAssignment);

        // Act
        var result = await _controller.Create(createDto);

        // Assert
        var createdAtResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(createdAssignment, createdAtResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsOkResult_WithUpdatedAssignment()
    {
        // Arrange
        var assignmentId = Guid.NewGuid();
        var updateDto = new CreateAssignmentDTO { Title = "Updated Assignment", Description = "Updated Description" };
        var updatedAssignment = new AssignmentDTO
        {
            Id = assignmentId,
            Title = updateDto.Title,
            Description = updateDto.Description,
            IsCompleted = true,
            CreatedAt = DateTime.UtcNow,
            Employee = new EmployeeDTO { Id = Guid.NewGuid(), FullName = "Jane Doe", Email = "janedoe@example.com" },
            Status = new StatusDTO { Id = Guid.NewGuid(), Description = "Completed" }
        };
        _mockAssignmentService.Setup(s => s.UpdateAsync(assignmentId, updateDto)).ReturnsAsync(updatedAssignment);

        // Act
        var result = await _controller.Update(assignmentId, updateDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(updatedAssignment, okResult.Value);
    }

    [Fact]
    public async Task Delete_ReturnsNoContentResult()
    {
        // Arrange
        var assignmentId = Guid.NewGuid();
        _mockAssignmentService.Setup(s => s.DeleteAsync(assignmentId)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Delete(assignmentId);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }
}