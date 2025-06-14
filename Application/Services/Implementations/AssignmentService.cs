using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;

public class AssignmentService : IAssignmentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AssignmentService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AssignmentDTO>> GetAllAsync()
    {
        var assignments = await _unitOfWork.Assignments.GetAllAsync();
        return _mapper.Map<IEnumerable<AssignmentDTO>>(assignments);
    }

    public async Task<AssignmentDTO> GetByIdAsync(Guid id)
    {
        var assignment = await _unitOfWork.Assignments.GetByIdAsync(id);
        if (assignment == null)
        {
            throw new KeyNotFoundException("No such Assignment exists.");
        }

        return _mapper.Map<AssignmentDTO>(assignment);
    }

    public async Task<AssignmentDTO> CreateAsync(CreateAssignmentDTO createAssignmentDto)
    {
        var employee = await _unitOfWork.Employees.GetByIdAsync(createAssignmentDto.EmployeeId);
        if (employee == null)
        {
            throw new ArgumentException("The Employee you are trying to assign does not exist.");
        }

        var status = await _unitOfWork.Statuses.GetByIdAsync(createAssignmentDto.StatusId);
        if (status == null)
        {
            throw new ArgumentException("The Status you are trying to assign does not exist.");
        }

        var categories = new List<Category>();
        foreach (var categoryId in createAssignmentDto.CategoryIds)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
            if (category == null)
            {
                throw new ArgumentException($"The Category with ID {categoryId} does not exist.");
            }
            categories.Add(category);
        }

        // Map and Create Assignment
        var assignment = new Assignment
        {
            Id = Guid.NewGuid(),
            Title = createAssignmentDto.Title,
            Description = createAssignmentDto.Description,
            Employee = employee,
            Status = status,
            AssignmentCategories = categories.Select(c => new AssignmentCategory
            {
                CategoryId = c.Id
            }).ToList(),
            IsCompleted = createAssignmentDto.IsCompleted,
            CreatedAt = DateTime.Now,
        };

        await _unitOfWork.Assignments.AddAsync(assignment);
        await _unitOfWork.CompleteAsync();

        return _mapper.Map<AssignmentDTO>(assignment);
    }

    public async Task<AssignmentDTO> UpdateAsync(Guid id, CreateAssignmentDTO updateAssignmentDTO)
    {
        var assignment = await _unitOfWork.Assignments.GetByIdAsync(id);
        if (assignment == null)
        {
            throw new KeyNotFoundException("The Assignment you are trying to update does not exist.");
        }

        // Validate Employee
        var employee = await _unitOfWork.Employees.GetByIdAsync(updateAssignmentDTO.EmployeeId);
        if (employee == null)
        {
            throw new ArgumentException("The Employee you are trying to assign does not exist.");
        }

        // Validate Status
        var status = await _unitOfWork.Statuses.GetByIdAsync(updateAssignmentDTO.StatusId);
        if (status == null)
        {
            throw new ArgumentException("The Status you are trying to assign does not exist.");
        }

        // Validate Categories
        var categories = new List<Category>();
        foreach (var categoryId in updateAssignmentDTO.CategoryIds)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
            if (category == null)
            {
                throw new ArgumentException($"The Category with ID {categoryId} does not exist.");
            }
            categories.Add(category);
        }

        // Update Assignment
        assignment.Title = updateAssignmentDTO.Title;
        assignment.Description = updateAssignmentDTO.Description;
        assignment.Employee = employee;
        assignment.Status = status;
        assignment.AssignmentCategories = categories.Select(c => new AssignmentCategory
        {
            AssignmentId = assignment.Id,
            CategoryId = c.Id
        }).ToList();
        assignment.IsCompleted = updateAssignmentDTO.IsCompleted;

        await _unitOfWork.Assignments.UpdateAsync(assignment);
        await _unitOfWork.CompleteAsync();
        return _mapper.Map<AssignmentDTO>(assignment);
    }

    public async Task DeleteAsync(Guid id)
    {
        var assignment = await _unitOfWork.Assignments.GetByIdAsync(id);
        if (assignment == null)
        {
            throw new KeyNotFoundException("The Assignment you are trying to delete does not exist.");
        }

        await _unitOfWork.Assignments.RemoveAsync(assignment);
        await _unitOfWork.CompleteAsync();
    }
}