using Application.DTOs;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetAll()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetById(Guid id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            return Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(CreateCategoryDTO createCategoryDTO)
        {
            await _categoryService.CreateCategoryAsync(createCategoryDTO);
            return Ok(new { createCategoryDTO.Name });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, CategoryDTO categoryDTO)
        {
            // Ensure the ID in the DTO matches the ID in the route
            categoryDTO.Id = id;
            await _categoryService.UpdateCategoryAsync(id, categoryDTO);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _categoryService.DeleteCategoryAsync(id);
            return NoContent();
        }
    }
}