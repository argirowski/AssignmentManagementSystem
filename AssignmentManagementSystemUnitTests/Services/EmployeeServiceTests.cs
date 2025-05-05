using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Moq;

public class EmployeeServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IMapper> _mockMapper;
    private readonly EmployeeService _service;

    public EmployeeServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new EmployeeService(_mockUnitOfWork.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task GetAllEmployeesAsync_ReturnsListOfEmployees()
    {
        // Arrange
        var employees = new List<Employee> { new Employee { Id = Guid.NewGuid(), FullName = "John Doe", Email = "johndoe@example.com" } };
        var employeeDTOs = new List<EmployeeDTO> { new EmployeeDTO { Id = employees[0].Id, FullName = employees[0].FullName, Email = employees[0].Email } };

        _mockUnitOfWork.Setup(u => u.Employees.GetAllAsync()).ReturnsAsync(employees);
        _mockMapper.Setup(m => m.Map<IEnumerable<EmployeeDTO>>(employees)).Returns(employeeDTOs);

        // Act
        var result = await _service.GetAllEmployeesAsync();

        // Assert
        Assert.Equal(employeeDTOs, result);
    }

    [Fact]
    public async Task GetEmployeeByIdAsync_ValidId_ReturnsEmployee()
    {
        // Arrange
        var employee = new Employee { Id = Guid.NewGuid(), FullName = "John Doe", Email = "johndoe@example.com" };
        var employeeDTO = new EmployeeDTO { Id = employee.Id, FullName = employee.FullName, Email = employee.Email };

        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(employee.Id)).ReturnsAsync(employee);
        _mockMapper.Setup(m => m.Map<EmployeeDTO>(employee)).Returns(employeeDTO);

        // Act
        var result = await _service.GetEmployeeByIdAsync(employee.Id);

        // Assert
        Assert.Equal(employeeDTO, result);
    }

    [Fact]
    public async Task GetEmployeeByIdAsync_InvalidId_ThrowsKeyNotFoundException()
    {
        // Arrange
        _mockUnitOfWork.Setup(u => u.Employees.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Employee)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.GetEmployeeByIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task CreateEmployeeAsync_ValidData_ReturnsCreatedEmployee()
    {
        // Arrange
        var createDto = new CreateEmployeeDTO { FullName = "John Doe", Email = "johndoe@example.com" };
        var employee = new Employee { Id = Guid.NewGuid(), FullName = createDto.FullName, Email = createDto.Email };
        var employeeDTO = new EmployeeDTO { Id = employee.Id, FullName = employee.FullName, Email = employee.Email };

        _mockUnitOfWork.Setup(u => u.Employees.GetByFullNameAsync(createDto.FullName)).ReturnsAsync((Employee)null);
        _mockUnitOfWork.Setup(u => u.Employees.AddAsync(It.IsAny<Employee>())).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CompleteAsync()).Returns(Task.FromResult(0));
        _mockMapper.Setup(m => m.Map<Employee>(createDto)).Returns(employee); // Fix: Map CreateEmployeeDTO to Employee
        _mockMapper.Setup(m => m.Map<EmployeeDTO>(It.IsAny<Employee>())).Returns(employeeDTO);

        // Act
        var result = await _service.CreateEmployeeAsync(createDto);

        // Assert
        Assert.Equal(employeeDTO, result);
    }

    [Fact]
    public async Task CreateEmployeeAsync_DuplicateName_ThrowsInvalidOperationException()
    {
        // Arrange
        var createDto = new CreateEmployeeDTO { FullName = "John Doe", Email = "johndoe@example.com" };
        var existingEmployee = new Employee { Id = Guid.NewGuid(), FullName = createDto.FullName, Email = createDto.Email };

        _mockUnitOfWork.Setup(u => u.Employees.GetByFullNameAsync(createDto.FullName)).ReturnsAsync(existingEmployee);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateEmployeeAsync(createDto));
    }
}