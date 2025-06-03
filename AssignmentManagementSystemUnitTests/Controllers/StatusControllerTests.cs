using Application.DTOs;
using Application.Services.Interfaces;
using API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace AssignmentManagementSystemUnitTests.Controllers
{
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
        public async Task GetAll_ReturnsOkWithStatuses()
        {
            // Arrange
            var statuses = new List<StatusDTO> { new StatusDTO { Id = Guid.NewGuid(), Description = "Test" } };
            _mockStatusService.Setup(s => s.GetAllStatusesAsync()).ReturnsAsync(statuses);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(statuses, okResult.Value);
        }

        [Fact]
        public async Task GetById_ReturnsOkWithStatus()
        {
            // Arrange
            var id = Guid.NewGuid();
            var status = new StatusDTO { Id = id, Description = "Test" };
            _mockStatusService.Setup(s => s.GetStatusByIdAsync(id)).ReturnsAsync(status);

            // Act
            var result = await _controller.GetById(id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(status, okResult.Value);
        }

        [Fact]
        public async Task Update_ReturnsNoContent()
        {
            // Arrange
            var id = Guid.NewGuid();
            var dto = new StatusDTO { Id = id, Description = "Test" };
            _mockStatusService.Setup(s => s.UpdateStatusAsync(id, dto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Update(id, dto);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNoContent()
        {
            // Arrange
            var id = Guid.NewGuid();
            _mockStatusService.Setup(s => s.DeleteStatusAsync(id)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Delete(id);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}
