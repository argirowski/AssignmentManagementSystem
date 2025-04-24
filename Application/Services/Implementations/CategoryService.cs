using Application.DTOs;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync()
        {
            var categories = await _unitOfWork.Categories.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryDTO>>(categories);
        }

        public async Task<CategoryDTO?> GetCategoryByIdAsync(Guid id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
                throw new KeyNotFoundException("No such Category exists.");

            return _mapper.Map<CategoryDTO?>(category);
        }

        public async Task CreateCategoryAsync(CreateCategoryDTO createCategoryDto)
        {
            // Check if a category with the same name already exists
            var existingCategory = await _unitOfWork.Categories.GetByNameAsync(createCategoryDto.Name);
            if (existingCategory != null)
            {
                throw new InvalidOperationException($"A category with the name '{createCategoryDto.Name}' already exists.");
            }

            var category = _mapper.Map<Category>(createCategoryDto);
            category.Id = Guid.NewGuid(); // Automatically generate the ID

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateCategoryAsync(Guid id, CategoryDTO categoryDto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                throw new KeyNotFoundException("The Category you are trying to update does not exist.");
            }
            // Check if a category with the same name already exists (excluding the current category)
            var existingCategory = await _unitOfWork.Categories.GetByNameAsync(categoryDto.Name);
            if (existingCategory != null && existingCategory.Id != id)
            {
                throw new InvalidOperationException($"A category with the name '{categoryDto.Name}' already exists.");
            }

            _mapper.Map(categoryDto, category);

            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteCategoryAsync(Guid id)
        {
            if (await _unitOfWork.Categories.IsCategoryLinkedToAssignmentsAsync(id))
                throw new InvalidOperationException("You cannot delete the Category because it is linked to one or more Assignments.");

            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
                throw new KeyNotFoundException("The Category you are trying to delete does not exist.");

            await _unitOfWork.Categories.DeleteAsync(id);
            await _unitOfWork.CompleteAsync();
        }
    }
}