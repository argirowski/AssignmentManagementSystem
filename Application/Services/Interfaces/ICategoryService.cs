using Application.DTOs;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync();
        Task<CategoryDTO?> GetCategoryByIdAsync(Guid id);
        Task CreateCategoryAsync(CreateCategoryDTO createCategoryDTO);
        Task UpdateCategoryAsync(Guid id, CategoryDTO categoryDTO);
        Task DeleteCategoryAsync(Guid id);
    }
}