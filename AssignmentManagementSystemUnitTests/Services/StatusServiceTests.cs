using Application.DTOs;
using Application.Services.Implementations;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Moq;

public class StatusServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IMapper> _mockMapper;
    private readonly StatusService _service;

    public StatusServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new StatusService(_mockUnitOfWork.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task GetAllStatusesAsync_ReturnsListOfStatuses()
    {
        // Arrange
        var statuses = new List<Status> { new Status { Id = Guid.NewGuid(), Description = "In Progress" } };
        var statusDTOs = new List<StatusDTO> { new StatusDTO { Id = statuses[0].Id, Description = statuses[0].Description } };

        _mockUnitOfWork.Setup(u => u.Statuses.GetAllAsync()).ReturnsAsync(statuses);
        _mockMapper.Setup(m => m.Map<IEnumerable<StatusDTO>>(statuses)).Returns(statusDTOs);

        // Act
        var result = await _service.GetAllStatusesAsync();

        // Assert
        Assert.Equal(statusDTOs, result);
    }

    [Fact]
    public async Task GetStatusByIdAsync_ValidId_ReturnsStatus()
    {
        // Arrange
        var status = new Status { Id = Guid.NewGuid(), Description = "In Progress" };
        var statusDTO = new StatusDTO { Id = status.Id, Description = status.Description };

        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(status.Id)).ReturnsAsync(status);
        _mockMapper.Setup(m => m.Map<StatusDTO>(status)).Returns(statusDTO);

        // Act
        var result = await _service.GetStatusByIdAsync(status.Id);

        // Assert
        Assert.Equal(statusDTO, result);
    }

    [Fact]
    public async Task GetStatusByIdAsync_InvalidId_ThrowsKeyNotFoundException()
    {
        // Arrange
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Status?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.GetStatusByIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task CreateStatusAsync_ValidData_CreatesStatus()
    {
        // Arrange
        var createDto = new CreateStatusDTO { Description = "In Progress" };
        var status = new Status { Id = Guid.NewGuid(), Description = createDto.Description };

        _mockUnitOfWork.Setup(u => u.Statuses.GetByDescriptionAsync(createDto.Description)).ReturnsAsync((Status?)null);
        _mockUnitOfWork.Setup(u => u.Statuses.AddAsync(It.IsAny<Status>())).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CompleteAsync()).Returns(Task.FromResult(0));
        _mockMapper.Setup(m => m.Map<Status>(createDto)).Returns(status);

        // Act
        await _service.CreateStatusAsync(createDto);

        // Assert
        _mockUnitOfWork.Verify(u => u.Statuses.AddAsync(It.Is<Status>(s => s.Description == createDto.Description)), Times.Once);
        _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateStatusAsync_DuplicateDescription_ThrowsInvalidOperationException()
    {
        // Arrange
        var createDto = new CreateStatusDTO { Description = "In Progress" };
        var existingStatus = new Status { Id = Guid.NewGuid(), Description = createDto.Description };

        _mockUnitOfWork.Setup(u => u.Statuses.GetByDescriptionAsync(createDto.Description)).ReturnsAsync(existingStatus);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateStatusAsync(createDto));
    }

    [Fact]
    public async Task UpdateStatusAsync_ValidData_UpdatesStatus()
    {
        // Arrange
        var id = Guid.NewGuid();
        var status = new Status { Id = id, Description = "Old" };
        var statusDto = new StatusDTO { Id = id, Description = "New" };
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(id)).ReturnsAsync(status);
        _mockUnitOfWork.Setup(u => u.Statuses.GetByDescriptionAsync(statusDto.Description)).ReturnsAsync((Status?)null);
        _mockUnitOfWork.Setup(u => u.Statuses.UpdateAsync(status)).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CompleteAsync()).ReturnsAsync(1);
        _mockMapper.Setup(m => m.Map(statusDto, status)).Verifiable();

        // Act
        await _service.UpdateStatusAsync(id, statusDto);

        // Assert
        _mockUnitOfWork.Verify(u => u.Statuses.UpdateAsync(status), Times.Once);
        _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateStatusAsync_StatusNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var statusDto = new StatusDTO { Id = id, Description = "New" };
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(id)).ReturnsAsync((Status?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.UpdateStatusAsync(id, statusDto));
    }

    [Fact]
    public async Task UpdateStatusAsync_DuplicateDescription_ThrowsInvalidOperationException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var status = new Status { Id = id, Description = "Old" };
        var statusDto = new StatusDTO { Id = id, Description = "Duplicate" };
        var existingStatus = new Status { Id = Guid.NewGuid(), Description = statusDto.Description };
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(id)).ReturnsAsync(status);
        _mockUnitOfWork.Setup(u => u.Statuses.GetByDescriptionAsync(statusDto.Description)).ReturnsAsync(existingStatus);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.UpdateStatusAsync(id, statusDto));
    }

    [Fact]
    public async Task DeleteStatusAsync_ValidId_DeletesStatus()
    {
        // Arrange
        var id = Guid.NewGuid();
        var status = new Status { Id = id, Description = "ToDelete" };
        _mockUnitOfWork.Setup(u => u.Statuses.IsStatusLinkedToAssignmentsAsync(id)).ReturnsAsync(false);
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(id)).ReturnsAsync(status);
        _mockUnitOfWork.Setup(u => u.Statuses.DeleteAsync(id)).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CompleteAsync()).ReturnsAsync(1);

        // Act
        await _service.DeleteStatusAsync(id);

        // Assert
        _mockUnitOfWork.Verify(u => u.Statuses.DeleteAsync(id), Times.Once);
        _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteStatusAsync_StatusLinkedToAssignments_ThrowsInvalidOperationException()
    {
        // Arrange
        var id = Guid.NewGuid();
        _mockUnitOfWork.Setup(u => u.Statuses.IsStatusLinkedToAssignmentsAsync(id)).ReturnsAsync(true);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.DeleteStatusAsync(id));
    }

    [Fact]
    public async Task DeleteStatusAsync_StatusNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var id = Guid.NewGuid();
        _mockUnitOfWork.Setup(u => u.Statuses.IsStatusLinkedToAssignmentsAsync(id)).ReturnsAsync(false);
        _mockUnitOfWork.Setup(u => u.Statuses.GetByIdAsync(id)).ReturnsAsync((Status?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.DeleteStatusAsync(id));
    }
}