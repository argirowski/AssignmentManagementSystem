using API.Controllers;
using Application.DTOs;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

public class StatusControllerTests
{
    private readonly Mock<IStatusService> _mockStatusService;
    private readonly StatusController _controller;

    public StatusControllerTests()
    {
        _mockStatusService = new Mock<IStatusService>();
        _controller = new StatusController(_mockStatusService.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult_WithListOfStatuses()
    {
        // Arrange
        var statuses = new List<StatusDTO> { new StatusDTO { Id = Guid.NewGuid(), Description = "Test Status" } };
        _mockStatusService.Setup(s => s.GetAllStatusesAsync()).ReturnsAsync(statuses);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(statuses, okResult.Value);
    }

    [Fact]
    public async Task GetById_ReturnsOkResult_WithStatus()
    {
        // Arrange
        var statusId = Guid.NewGuid();
        var status = new StatusDTO { Id = statusId, Description = "Test Status" };
        _mockStatusService.Setup(s => s.GetStatusByIdAsync(statusId)).ReturnsAsync(status);

        // Act
        var result = await _controller.GetById(statusId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(status, okResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsOkResult_WithCreatedStatus()
    {
        // Arrange
        var createDto = new CreateStatusDTO { Description = "New Status" };
        _mockStatusService.Setup(s => s.CreateStatusAsync(createDto)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Create(createDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsNoContentResult()
    {
        // Arrange
        var statusId = Guid.NewGuid();
        var updateDto = new StatusDTO { Id = statusId, Description = "Updated Status" };
        _mockStatusService.Setup(s => s.UpdateStatusAsync(statusId, updateDto)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Update(statusId, updateDto);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContentResult()
    {
        // Arrange
        var statusId = Guid.NewGuid();
        _mockStatusService.Setup(s => s.DeleteStatusAsync(statusId)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Delete(statusId);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }
}