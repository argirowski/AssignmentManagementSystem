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
        var assignments = new List<Assignment>
        {
            new Assignment
            {
                Id = Guid.NewGuid(),
                Title = "Test Assignment",
                Description = "Test Description",
                Employee = new Employee { Id = Guid.NewGuid(), FullName = "John Doe", Email = "johndoe@example.com" },
                Status = new Status { Id = Guid.NewGuid(), Description = "In Progress" },
                AssignmentCategories = new List<AssignmentCategory>
                {
                    new AssignmentCategory { Category = new Category { Id = Guid.NewGuid(), Name = "Category1" } }
                }
            }
        };

        var assignmentDTOs = new List<AssignmentDTO>
        {
            new()
            {
                Id = assignments[0].Id,
                Title = assignments[0].Title,
                Description = assignments[0].Description,
                Employee = new EmployeeDTO
                {
                    Id = assignments[0].Employee.Id,
                    FullName = assignments[0].Employee.FullName,
                    Email = assignments[0].Employee.Email
                },
                Status = new StatusDTO
                {
                    Id = assignments[0].Status.Id,
                    Description = assignments[0].Status.Description
                },
                Categories = assignments[0].AssignmentCategories
                    .Select(ac => new CategoryDTO { Id = ac.Category.Id, Name = ac.Category.Name })
                    .ToList()
            }
        };

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
        var assignment = new Assignment
        {
            Id = Guid.NewGuid(),
            Title = "Test Assignment",
            Description = "Test Description",
            Employee = new Employee { Id = Guid.NewGuid(), FullName = "John Doe", Email = "johndoe@example.com" },
            Status = new Status { Id = Guid.NewGuid(), Description = "In Progress" },
            AssignmentCategories = new List<AssignmentCategory>
            {
                new AssignmentCategory { Category = new Category { Id = Guid.NewGuid(), Name = "Category1" } }
            }
        };

        var assignmentDTO = new AssignmentDTO
        {
            Id = assignment.Id,
            Title = assignment.Title,
            Description = assignment.Description,
            Employee = new EmployeeDTO
            {
                Id = assignment.Employee.Id,
                FullName = assignment.Employee.FullName,
                Email = assignment.Employee.Email
            },
            Status = new StatusDTO
            {
                Id = assignment.Status.Id,
                Description = assignment.Status.Description
            },
            Categories = assignment.AssignmentCategories
                .Select(ac => new CategoryDTO { Id = ac.Category.Id, Name = ac.Category.Name })
                .ToList()
        };

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
        var createDto = new CreateAssignmentDTO
        {
            Title = "New Assignment",
            Description = "Default Description",
            EmployeeId = Guid.NewGuid(),
            StatusId = Guid.NewGuid(),
            CategoryIds = new()
        };
        var employee = new Employee { Id = createDto.EmployeeId, FullName = "John Doe", Email = "johndoe@example.com" };
        var status = new Status { Id = createDto.StatusId, Description = "In Progress" };
        var categories = new List<CategoryDTO> { new CategoryDTO { Id = Guid.NewGuid(), Name = "Category1" } }; // Mock categories
        var assignment = new Assignment
        {
            Id = Guid.NewGuid(),
            Title = createDto.Title,
            Description = createDto.Description,
            Employee = employee,
            Status = status
        };
        var assignmentDTO = new AssignmentDTO
        {
            Id = assignment.Id,
            Title = assignment.Title,
            Description = assignment.Description,
            Employee = new EmployeeDTO { Id = employee.Id, FullName = employee.FullName, Email = employee.Email },
            Status = new StatusDTO { Id = status.Id, Description = status.Description },
            Categories = categories
        };

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
        var createDto = new CreateAssignmentDTO
        {
            Title = "New Assignment",
            Description = "Default Description",
            EmployeeId = Guid.NewGuid(),
            StatusId = Guid.NewGuid(),
            CategoryIds = new()
        };
        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(createDto.EmployeeId)).ReturnsAsync((Employee)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateAsync(createDto));
    }

    [Fact]
    public async Task CreateAsync_InvalidStatus_ThrowsArgumentException()
    {
        // Arrange
        var createDto = new CreateAssignmentDTO
        {
            Title = "New Assignment",
            Description = "Default Description",
            EmployeeId = Guid.NewGuid(),
            StatusId = Guid.NewGuid(),
            CategoryIds = new()
        };
        var employee = new Employee { Id = createDto.EmployeeId, FullName = "John Doe", Email = "johndoe@example.com" };
        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(createDto.EmployeeId)).ReturnsAsync(employee);
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(createDto.StatusId)).ReturnsAsync((Status?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateAsync(createDto));
    }

    [Fact]
    public async Task CreateAsync_InvalidCategory_ThrowsArgumentException()
    {
        // Arrange
        var badCategoryId = Guid.NewGuid();
        var createDto = new CreateAssignmentDTO
        {
            Title = "New Assignment",
            Description = "Default Description",
            EmployeeId = Guid.NewGuid(),
            StatusId = Guid.NewGuid(),
            CategoryIds = new List<Guid> { badCategoryId }
        };
        var employee = new Employee { Id = createDto.EmployeeId, FullName = "John Doe", Email = "johndoe@example.com" };
        var status = new Status { Id = createDto.StatusId, Description = "In Progress" };
        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(createDto.EmployeeId)).ReturnsAsync(employee);
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(createDto.StatusId)).ReturnsAsync(status);
        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(badCategoryId)).ReturnsAsync((Category?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateAsync(createDto));
    }

    [Fact]
    public async Task DeleteAsync_ValidId_DeletesAssignment()
    {
        // Arrange
        var id = Guid.NewGuid();
        var assignment = new Assignment { Id = id, Title = "Test Assignment", Description = "desc" };
        _mockUnitOfWork.Setup(u => u.Assignments.GetByIdAsync(id)).ReturnsAsync(assignment);
        _mockUnitOfWork.Setup(u => u.Assignments.RemoveAsync(assignment)).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CompleteAsync()).ReturnsAsync(1);

        // Act
        await _service.DeleteAsync(id);

        // Assert
        _mockUnitOfWork.Verify(u => u.Assignments.RemoveAsync(assignment), Times.Once);
        _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_AssignmentNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var id = Guid.NewGuid();
        _mockUnitOfWork.Setup(u => u.Assignments.GetByIdAsync(id)).ReturnsAsync((Assignment?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.DeleteAsync(id));
    }

    [Fact]
    public async Task UpdateAsync_ValidData_UpdatesAssignment()
    {
        // Arrange
        var id = Guid.NewGuid();
        var employeeId = Guid.NewGuid();
        var statusId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var assignment = new Assignment { Id = id, Title = "Old Title", Description = "desc" };
        var employee = new Employee { Id = employeeId, FullName = "John Doe", Email = "john@example.com" };
        var status = new Status { Id = statusId, Description = "In Progress" };
        var category = new Category { Id = categoryId, Name = "Cat1" };
        var updateDto = new CreateAssignmentDTO
        {
            Title = "New Title",
            Description = "New Desc",
            EmployeeId = employeeId,
            StatusId = statusId,
            CategoryIds = new List<Guid> { categoryId },
            IsCompleted = true
        };
        var assignmentDto = new AssignmentDTO
        {
            Id = id,
            Title = updateDto.Title,
            Description = updateDto.Description,
            Employee = new EmployeeDTO { Id = employeeId, FullName = employee.FullName, Email = employee.Email },
            Status = new StatusDTO { Id = statusId, Description = status.Description },
            Categories = new List<CategoryDTO> { new CategoryDTO { Id = categoryId, Name = category.Name } }
        };
        _mockUnitOfWork.Setup(u => u.Assignments.GetByIdAsync(id)).ReturnsAsync(assignment);
        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(employeeId)).ReturnsAsync(employee);
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(statusId)).ReturnsAsync(status);
        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(categoryId)).ReturnsAsync(category);
        _mockUnitOfWork.Setup(u => u.Assignments.UpdateAsync(assignment)).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CompleteAsync()).ReturnsAsync(1);
        _mockMapper.Setup(m => m.Map<AssignmentDTO>(assignment)).Returns(assignmentDto);

        // Act
        var result = await _service.UpdateAsync(id, updateDto);

        // Assert
        Assert.Equal(updateDto.Title, result.Title);
        Assert.Equal(updateDto.Description, result.Description);
        _mockUnitOfWork.Verify(u => u.Assignments.UpdateAsync(assignment), Times.Once);
        _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_AssignmentNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var updateDto = new CreateAssignmentDTO { Title = "T", Description = "D", EmployeeId = Guid.NewGuid(), StatusId = Guid.NewGuid(), CategoryIds = new() };
        _mockUnitOfWork.Setup(u => u.Assignments.GetByIdAsync(id)).ReturnsAsync((Assignment?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.UpdateAsync(id, updateDto));
    }

    [Fact]
    public async Task UpdateAsync_InvalidEmployee_ThrowsArgumentException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var assignment = new Assignment { Id = id, Title = "T", Description = "D" };
        var updateDto = new CreateAssignmentDTO { Title = "T", Description = "D", EmployeeId = Guid.NewGuid(), StatusId = Guid.NewGuid(), CategoryIds = new() };
        _mockUnitOfWork.Setup(u => u.Assignments.GetByIdAsync(id)).ReturnsAsync(assignment);
        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(updateDto.EmployeeId)).ReturnsAsync((Employee?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.UpdateAsync(id, updateDto));
    }

    [Fact]
    public async Task UpdateAsync_InvalidStatus_ThrowsArgumentException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var assignment = new Assignment { Id = id, Title = "T", Description = "D" };
        var employee = new Employee { Id = Guid.NewGuid(), FullName = "John Doe", Email = "john@example.com" };
        var updateDto = new CreateAssignmentDTO { Title = "T", Description = "D", EmployeeId = employee.Id, StatusId = Guid.NewGuid(), CategoryIds = new() };
        _mockUnitOfWork.Setup(u => u.Assignments.GetByIdAsync(id)).ReturnsAsync(assignment);
        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(employee.Id)).ReturnsAsync(employee);
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(updateDto.StatusId)).ReturnsAsync((Status?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.UpdateAsync(id, updateDto));
    }

    [Fact]
    public async Task UpdateAsync_InvalidCategory_ThrowsArgumentException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var assignment = new Assignment { Id = id, Title = "T", Description = "D" };
        var employee = new Employee { Id = Guid.NewGuid(), FullName = "John Doe", Email = "john@example.com" };
        var status = new Status { Id = Guid.NewGuid(), Description = "In Progress" };
        var badCategoryId = Guid.NewGuid();
        var updateDto = new CreateAssignmentDTO { Title = "T", Description = "D", EmployeeId = employee.Id, StatusId = status.Id, CategoryIds = new List<Guid> { badCategoryId } };
        _mockUnitOfWork.Setup(u => u.Assignments.GetByIdAsync(id)).ReturnsAsync(assignment);
        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(employee.Id)).ReturnsAsync(employee);
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(status.Id)).ReturnsAsync(status);
        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(badCategoryId)).ReturnsAsync((Category?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.UpdateAsync(id, updateDto));
    }
}