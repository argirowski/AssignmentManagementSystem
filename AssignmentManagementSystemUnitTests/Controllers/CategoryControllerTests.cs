using Application.DTOs;
using Application.Services.Interfaces;
using API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace AssignmentManagementSystemUnitTests.Controllers
{
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
        public async Task GetAll_ReturnsOkWithCategories()
        {
            var categories = new List<CategoryDTO> { new CategoryDTO { Id = Guid.NewGuid(), Name = "Test" } };
            _mockCategoryService.Setup(s => s.GetAllCategoriesAsync()).ReturnsAsync(categories);

            var result = await _controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(categories, okResult.Value);
        }

        [Fact]
        public async Task GetById_ReturnsOkWithCategory()
        {
            var id = Guid.NewGuid();
            var category = new CategoryDTO { Id = id, Name = "Test" };
            _mockCategoryService.Setup(s => s.GetCategoryByIdAsync(id)).ReturnsAsync(category);

            var result = await _controller.GetById(id);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(category, okResult.Value);
        }

        [Fact]
        public async Task Update_ReturnsNoContent()
        {
            var id = Guid.NewGuid();
            var dto = new CategoryDTO { Id = id, Name = "Test" };
            _mockCategoryService.Setup(s => s.UpdateCategoryAsync(id, dto)).Returns(Task.CompletedTask);

            var result = await _controller.Update(id, dto);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNoContent()
        {
            var id = Guid.NewGuid();
            _mockCategoryService.Setup(s => s.DeleteCategoryAsync(id)).Returns(Task.CompletedTask);

            var result = await _controller.Delete(id);

            Assert.IsType<NoContentResult>(result);
        }
    }
}
