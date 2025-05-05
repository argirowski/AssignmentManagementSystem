using Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Moq;

public class EmployeeControllerTests
{
    private readonly Mock<IEmployeeService> _mockEmployeeService;
    private readonly EmployeeController _controller;

    public EmployeeControllerTests()
    {
        _mockEmployeeService = new Mock<IEmployeeService>();
        _controller = new EmployeeController(_mockEmployeeService.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult_WithListOfEmployees()
    {
        // Arrange  
        var employees = new List<EmployeeDTO>
       {
           new EmployeeDTO
           {
               Id = Guid.NewGuid(),
               FullName = "Test Employee",
               Email = "test.employee@example.com"
           }
       };
        _mockEmployeeService.Setup(s => s.GetAllEmployeesAsync()).ReturnsAsync(employees);

        // Act  
        var result = await _controller.GetAll();

        // Assert  
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(employees, okResult.Value);
    }

    [Fact]
    public async Task GetById_ReturnsOkResult_WithEmployee()
    {
        // Arrange  
        var employeeId = Guid.NewGuid();
        var employee = new EmployeeDTO { Id = employeeId, FullName = "Test Employee", Email = "test.employee@example.com" };
        _mockEmployeeService.Setup(s => s.GetEmployeeByIdAsync(employeeId)).ReturnsAsync(employee);

        // Act  
        var result = await _controller.GetById(employeeId);

        // Assert  
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(employee, okResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtActionResult_WithCreatedEmployee()
    {
        // Arrange  
        var createDto = new CreateEmployeeDTO { FullName = "New Employee", Email = "new.employee@example.com" };
        var createdEmployee = new EmployeeDTO { Id = Guid.NewGuid(), FullName = createDto.FullName, Email = createDto.Email };
        _mockEmployeeService.Setup(s => s.CreateEmployeeAsync(createDto)).ReturnsAsync(createdEmployee);

        // Act  
        var result = await _controller.Create(createDto);

        // Assert  
        var createdAtResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(createdEmployee, createdAtResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsOkResult_WithUpdatedEmployee()
    {
        // Arrange  
        var employeeId = Guid.NewGuid();
        var updateDto = new EmployeeDTO { Id = employeeId, FullName = "Updated Employee", Email = "updated.employee@example.com" };
        var updatedEmployee = new EmployeeDTO { Id = employeeId, FullName = updateDto.FullName, Email = updateDto.Email };
        _mockEmployeeService.Setup(s => s.UpdateEmployeeAsync(employeeId, updateDto)).ReturnsAsync(updatedEmployee);

        // Act  
        var result = await _controller.Update(employeeId, updateDto);

        // Assert  
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(updatedEmployee, okResult.Value);
    }

    [Fact]
    public async Task Delete_ReturnsNoContentResult()
    {
        // Arrange
        var employeeId = Guid.NewGuid();
        _mockEmployeeService.Setup(s => s.DeleteEmployeeAsync(employeeId)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Delete(employeeId);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }
}