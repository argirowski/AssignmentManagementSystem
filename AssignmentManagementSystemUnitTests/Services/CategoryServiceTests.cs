using Application.DTOs;
using Application.Services.Implementations;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Moq;

public class CategoryServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IMapper> _mockMapper;
    private readonly CategoryService _service;

    public CategoryServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new CategoryService(_mockUnitOfWork.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task GetAllCategoriesAsync_ReturnsListOfCategories()
    {
        // Arrange
        var categories = new List<Category> { new Category { Id = Guid.NewGuid(), Name = "Test Category" } };
        var categoryDTOs = new List<CategoryDTO> { new CategoryDTO { Id = categories[0].Id, Name = categories[0].Name } };

        _mockUnitOfWork.Setup(u => u.Categories.GetAllAsync()).ReturnsAsync(categories);
        _mockMapper.Setup(m => m.Map<IEnumerable<CategoryDTO>>(categories)).Returns(categoryDTOs);

        // Act
        var result = await _service.GetAllCategoriesAsync();

        // Assert
        Assert.Equal(categoryDTOs, result);
    }

    [Fact]
    public async Task GetCategoryByIdAsync_ValidId_ReturnsCategory()
    {
        // Arrange
        var category = new Category { Id = Guid.NewGuid(), Name = "Test Category" };
        var categoryDTO = new CategoryDTO { Id = category.Id, Name = category.Name };

        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(category.Id)).ReturnsAsync(category);
        _mockMapper.Setup(m => m.Map<CategoryDTO>(category)).Returns(categoryDTO);

        // Act
        var result = await _service.GetCategoryByIdAsync(category.Id);

        // Assert
        Assert.Equal(categoryDTO, result);
    }

    [Fact]
    public async Task GetCategoryByIdAsync_InvalidId_ThrowsKeyNotFoundException()
    {
        // Arrange
        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Category?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.GetCategoryByIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task CreateCategoryAsync_ValidData_CreatesCategory()
    {
        // Arrange
        var createDto = new CreateCategoryDTO { Name = "New Category" };
        var category = new Category { Id = Guid.NewGuid(), Name = createDto.Name };

        _mockUnitOfWork.Setup(u => u.Categories.GetByNameAsync(createDto.Name)).ReturnsAsync((Category?)null);
        _mockUnitOfWork.Setup(u => u.Categories.AddAsync(It.IsAny<Category>())).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CompleteAsync()).Returns(Task.FromResult(1));
        _mockMapper.Setup(m => m.Map<Category>(createDto)).Returns(category);

        // Act
        await _service.CreateCategoryAsync(createDto);

        // Assert
        _mockUnitOfWork.Verify(u => u.Categories.AddAsync(It.Is<Category>(c => c.Name == createDto.Name)), Times.Once);
        _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateCategoryAsync_DuplicateName_ThrowsInvalidOperationException()
    {
        // Arrange
        var createDto = new CreateCategoryDTO { Name = "Duplicate Category" };
        var existingCategory = new Category { Id = Guid.NewGuid(), Name = createDto.Name };

        _mockUnitOfWork.Setup(u => u.Categories.GetByNameAsync(createDto.Name)).ReturnsAsync(existingCategory);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateCategoryAsync(createDto));
    }

    [Fact]
    public async Task UpdateCategoryAsync_ValidData_UpdatesCategory()
    {
        // Arrange
        var id = Guid.NewGuid();
        var category = new Category { Id = id, Name = "Old" };
        var categoryDto = new CategoryDTO { Id = id, Name = "New" };
        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(id)).ReturnsAsync(category);
        _mockUnitOfWork.Setup(u => u.Categories.GetByNameAsync(categoryDto.Name)).ReturnsAsync((Category?)null);
        _mockUnitOfWork.Setup(u => u.Categories.UpdateAsync(category)).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CompleteAsync()).ReturnsAsync(1);
        _mockMapper.Setup(m => m.Map(categoryDto, category)).Verifiable();

        // Act
        await _service.UpdateCategoryAsync(id, categoryDto);

        // Assert
        _mockUnitOfWork.Verify(u => u.Categories.UpdateAsync(category), Times.Once);
        _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateCategoryAsync_CategoryNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var categoryDto = new CategoryDTO { Id = id, Name = "New" };
        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(id)).ReturnsAsync((Category?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.UpdateCategoryAsync(id, categoryDto));
    }

    [Fact]
    public async Task UpdateCategoryAsync_DuplicateName_ThrowsInvalidOperationException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var category = new Category { Id = id, Name = "Old" };
        var categoryDto = new CategoryDTO { Id = id, Name = "Duplicate" };
        var existingCategory = new Category { Id = Guid.NewGuid(), Name = categoryDto.Name };
        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(id)).ReturnsAsync(category);
        _mockUnitOfWork.Setup(u => u.Categories.GetByNameAsync(categoryDto.Name)).ReturnsAsync(existingCategory);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.UpdateCategoryAsync(id, categoryDto));
    }

    [Fact]
    public async Task DeleteCategoryAsync_ValidId_DeletesCategory()
    {
        // Arrange
        var id = Guid.NewGuid();
        var category = new Category { Id = id, Name = "ToDelete" };
        _mockUnitOfWork.Setup(u => u.Categories.IsCategoryLinkedToAssignmentsAsync(id)).ReturnsAsync(false);
        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(id)).ReturnsAsync(category);
        _mockUnitOfWork.Setup(u => u.Categories.DeleteAsync(id)).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CompleteAsync()).ReturnsAsync(1);

        // Act
        await _service.DeleteCategoryAsync(id);

        // Assert
        _mockUnitOfWork.Verify(u => u.Categories.DeleteAsync(id), Times.Once);
        _mockUnitOfWork.Verify(u => u.CompleteAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteCategoryAsync_CategoryLinkedToAssignments_ThrowsInvalidOperationException()
    {
        // Arrange
        var id = Guid.NewGuid();
        _mockUnitOfWork.Setup(u => u.Categories.IsCategoryLinkedToAssignmentsAsync(id)).ReturnsAsync(true);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.DeleteCategoryAsync(id));
    }

    [Fact]
    public async Task DeleteCategoryAsync_CategoryNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var id = Guid.NewGuid();
        _mockUnitOfWork.Setup(u => u.Categories.IsCategoryLinkedToAssignmentsAsync(id)).ReturnsAsync(false);
        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(id)).ReturnsAsync((Category?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.DeleteCategoryAsync(id));
    }
}