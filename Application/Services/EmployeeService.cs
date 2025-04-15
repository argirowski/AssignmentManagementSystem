using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Application.DTOs;
using Application.Interfaces;

namespace Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public EmployeeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EmployeeDTO>> GetAllEmployeesAsync()
        {
            var employees = await _unitOfWork.EmployeeRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<EmployeeDTO>>(employees);
        }

        public async Task<EmployeeDTO?> GetEmployeeByIdAsync(Guid id)
        {
            var employee = await _unitOfWork.EmployeeRepository.GetByIdAsync(id);
            return _mapper.Map<EmployeeDTO?>(employee);
        }

        public async Task<EmployeeDTO> AddEmployeeAsync(CreateEmployeeDTO createEmployeeDto)
        {
            var employee = _mapper.Map<Employee>(createEmployeeDto);
            employee.Id = Guid.NewGuid(); // Ensure unique Id
            await _unitOfWork.EmployeeRepository.AddAsync(employee);

            if (createEmployeeDto.Assignments != null && createEmployeeDto.Assignments.Any())
            {
                foreach (var createAssignmentDto in createEmployeeDto.Assignments)
                {
                    var assignment = _mapper.Map<Assignment>(createAssignmentDto);
                    assignment.Id = Guid.NewGuid(); // Generate new Id
                    assignment.CreatedAt = DateTime.UtcNow; // Set CreatedAt to current date and time
                    assignment.EmployeeId = employee.Id; // Set the generated EmployeeId
                    await _unitOfWork.EmployeeRepository.AddAssignmentAsync(assignment);

                    if (createAssignmentDto.Tags != null && createAssignmentDto.Tags.Any())
                    {
                        foreach (var tagDto in createAssignmentDto.Tags)
                        {
                            var tag = _mapper.Map<Tag>(tagDto);
                            await _unitOfWork.EmployeeRepository.AddTagAsync(tag);
                            await _unitOfWork.EmployeeRepository.AddAssignmentTagAsync(assignment.Id, tag.Id);
                        }
                    }
                }
            }

            // Commit the transaction for employee, assignments, and tags
            await _unitOfWork.CommitAsync();

            return _mapper.Map<EmployeeDTO>(employee);
        }

        public async Task UpdateEmployeeAsync(EmployeeDTO employeeDto)
        {
            var employee = _mapper.Map<Employee>(employeeDto);
            await _unitOfWork.EmployeeRepository.UpdateAsync(employee);
            await _unitOfWork.CommitAsync();
        }

        public async Task DeleteEmployeeAsync(Guid id)
        {
            await _unitOfWork.EmployeeRepository.DeleteAsync(id);
            await _unitOfWork.CommitAsync();
        }
    }
}