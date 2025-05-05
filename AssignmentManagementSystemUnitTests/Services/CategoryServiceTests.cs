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
        _mockUnitOfWork.Setup(u => u.Categories.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Category)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.GetCategoryByIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task CreateCategoryAsync_ValidData_CreatesCategory()
    {
        // Arrange
        var createDto = new CreateCategoryDTO { Name = "New Category" };
        var category = new Category { Id = Guid.NewGuid(), Name = createDto.Name };

        _mockUnitOfWork.Setup(u => u.Categories.GetByNameAsync(createDto.Name)).ReturnsAsync((Category)null);
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
}