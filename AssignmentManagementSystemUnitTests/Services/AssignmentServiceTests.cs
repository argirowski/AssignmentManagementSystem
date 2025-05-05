using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Moq;

public class AssignmentServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IMapper> _mockMapper;
    private readonly AssignmentService _service;

    public AssignmentServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new AssignmentService(_mockUnitOfWork.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsListOfAssignments()
    {
        // Arrange
        var assignments = new List<Assignment> { new Assignment { Id = Guid.NewGuid(), Title = "Test Assignment", Description = "Test Description" } };
        var assignmentDTOs = new List<AssignmentDTO> { new AssignmentDTO { Id = assignments[0].Id, Title = assignments[0].Title, Description = assignments[0].Description } };

        _mockUnitOfWork.Setup(u => u.Assignments.GetAllAsync()).ReturnsAsync(assignments);
        _mockMapper.Setup(m => m.Map<IEnumerable<AssignmentDTO>>(assignments)).Returns(assignmentDTOs);

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        Assert.Equal(assignmentDTOs, result);
    }

    [Fact]
    public async Task GetByIdAsync_ValidId_ReturnsAssignment()
    {
        // Arrange
        var assignment = new Assignment { Id = Guid.NewGuid(), Title = "Test Assignment", Description = "Test Description" };
        var assignmentDTO = new AssignmentDTO { Id = assignment.Id, Title = assignment.Title, Description = assignment.Description };

        _mockUnitOfWork.Setup(u => u.Assignments.GetByIdAsync(assignment.Id)).ReturnsAsync(assignment);
        _mockMapper.Setup(m => m.Map<AssignmentDTO>(assignment)).Returns(assignmentDTO);

        // Act
        var result = await _service.GetByIdAsync(assignment.Id);

        // Assert
        Assert.Equal(assignmentDTO, result);
    }

    [Fact]
    public async Task GetByIdAsync_InvalidId_ThrowsKeyNotFoundException()
    {
        // Arrange
        _mockUnitOfWork.Setup(u => u.Assignments.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Assignment)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.GetByIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task CreateAsync_ValidData_ReturnsCreatedAssignment()
    {
        // Arrange
        var createDto = new CreateAssignmentDTO { Title = "New Assignment", EmployeeId = Guid.NewGuid(), StatusId = Guid.NewGuid(), CategoryIds = new List<Guid>() };
        var employee = new Employee { Id = createDto.EmployeeId, FullName = "John Doe", Email = "johndoe@example.com" };
        var status = new Status { Id = createDto.StatusId, Description = "In Progress" };
        var assignment = new Assignment { Id = Guid.NewGuid(), Title = createDto.Title, Description = "Default Description", Employee = employee, Status = status };
        var assignmentDTO = new AssignmentDTO { Id = assignment.Id, Title = assignment.Title, Description = assignment.Description };

        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(createDto.EmployeeId)).ReturnsAsync(employee);
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(createDto.StatusId)).ReturnsAsync(status);
        _mockUnitOfWork.Setup(u => u.Assignments.AddAsync(It.IsAny<Assignment>())).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CompleteAsync()).Returns(Task.FromResult(1));
        _mockMapper.Setup(m => m.Map<AssignmentDTO>(It.IsAny<Assignment>())).Returns(assignmentDTO);

        // Act
        var result = await _service.CreateAsync(createDto);

        // Assert
        Assert.Equal(assignmentDTO, result);
    }

    [Fact]
    public async Task CreateAsync_InvalidEmployee_ThrowsArgumentException()
    {
        // Arrange
        var createDto = new CreateAssignmentDTO { Title = "New Assignment", EmployeeId = Guid.NewGuid(), StatusId = Guid.NewGuid(), CategoryIds = new List<Guid>() };
        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(createDto.EmployeeId)).ReturnsAsync((Employee)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateAsync(createDto));
    }
}