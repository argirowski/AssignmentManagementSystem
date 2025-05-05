using API.Controllers;
using Application.DTOs;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

public class CategoryControllerTests
{
    private readonly Mock<ICategoryService> _mockCategoryService;
    private readonly CategoryController _controller;

    public CategoryControllerTests()
    {
        _mockCategoryService = new Mock<ICategoryService>();
        _controller = new CategoryController(_mockCategoryService.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult_WithListOfCategories()
    {
        // Arrange
        var categories = new List<CategoryDTO> { new CategoryDTO { Id = Guid.NewGuid(), Name = "Test Category" } };
        _mockCategoryService.Setup(s => s.GetAllCategoriesAsync()).ReturnsAsync(categories);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(categories, okResult.Value);
    }

    [Fact]
    public async Task GetById_ReturnsOkResult_WithCategory()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var category = new CategoryDTO { Id = categoryId, Name = "Test Category" };
        _mockCategoryService.Setup(s => s.GetCategoryByIdAsync(categoryId)).ReturnsAsync(category);

        // Act
        var result = await _controller.GetById(categoryId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(category, okResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsOkResult_WithCreatedCategory()
    {
        // Arrange
        var createDto = new CreateCategoryDTO { Name = "New Category" };
        _mockCategoryService.Setup(s => s.CreateCategoryAsync(createDto)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Create(createDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsNoContentResult()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var updateDto = new CategoryDTO { Id = categoryId, Name = "Updated Category" };
        _mockCategoryService.Setup(s => s.UpdateCategoryAsync(categoryId, updateDto)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Update(categoryId, updateDto);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContentResult()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        _mockCategoryService.Setup(s => s.DeleteCategoryAsync(categoryId)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Delete(categoryId);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }
}