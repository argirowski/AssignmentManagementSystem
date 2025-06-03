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
    public async Task GetAll_ReturnsOkWithEmployees()
    {
        var employees = new List<EmployeeDTO> { new EmployeeDTO { Id = Guid.NewGuid(), FullName = "Test", Email = "test@test.com" } };
        _mockEmployeeService.Setup(s => s.GetAllEmployeesAsync()).ReturnsAsync(employees);

        var result = await _controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(employees, okResult.Value);
    }

    [Fact]
    public async Task GetById_ReturnsOkWithEmployee()
    {
        var id = Guid.NewGuid();
        var employee = new EmployeeDTO { Id = id, FullName = "Test", Email = "test@test.com" };
        _mockEmployeeService.Setup(s => s.GetEmployeeByIdAsync(id)).ReturnsAsync(employee);

        var result = await _controller.GetById(id);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(employee, okResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtActionWithEmployee()
    {
        var createDto = new CreateEmployeeDTO { FullName = "Test", Email = "test@test.com" };
        var createdEmployee = new EmployeeDTO { Id = Guid.NewGuid(), FullName = createDto.FullName, Email = createDto.Email };
        _mockEmployeeService.Setup(s => s.CreateEmployeeAsync(createDto)).ReturnsAsync(createdEmployee);

        var result = await _controller.Create(createDto);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(createdEmployee, createdAtActionResult.Value);
        Assert.Equal(nameof(_controller.GetById), createdAtActionResult.ActionName);
    }

    [Fact]
    public async Task Update_ReturnsOkWithUpdatedEmployee()
    {
        var id = Guid.NewGuid();
        var employeeDto = new EmployeeDTO { Id = id, FullName = "Test", Email = "test@test.com" };
        _mockEmployeeService.Setup(s => s.UpdateEmployeeAsync(id, employeeDto)).ReturnsAsync(employeeDto);

        var result = await _controller.Update(id, employeeDto);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(employeeDto, okResult.Value);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent()
    {
        var id = Guid.NewGuid();
        _mockEmployeeService.Setup(s => s.DeleteEmployeeAsync(id)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(id);

        Assert.IsType<NoContentResult>(result);
    }
}
