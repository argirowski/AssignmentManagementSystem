using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;

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
        var employees = await _unitOfWork.Employees.GetAllAsync();
        return _mapper.Map<IEnumerable<EmployeeDTO>>(employees);
    }

    public async Task<EmployeeDTO> GetEmployeeByIdAsync(Guid id)
    {
        var employee = await _unitOfWork.Employees.GetByIdAsync(id);

        if (employee == null)
        {
            throw new KeyNotFoundException("No such Employee exists.");
        }

        return _mapper.Map<EmployeeDTO>(employee);
    }

    public async Task<EmployeeDTO> CreateEmployeeAsync(CreateEmployeeDTO createEmployeeDTO)
    {
        var existingEmployee = await _unitOfWork.Employees.GetByFullNameAsync(createEmployeeDTO.FullName);

        if (existingEmployee != null)
        {
            throw new InvalidOperationException($"An employee with the name '{createEmployeeDTO.FullName}' already exists.");
        }

        var employee = _mapper.Map<Employee>(createEmployeeDTO);
        employee.Id = Guid.NewGuid(); // Automatically generate the ID
        await _unitOfWork.Employees.AddAsync(employee);
        await _unitOfWork.CompleteAsync();
        return _mapper.Map<EmployeeDTO>(employee);
    }

    public async Task<EmployeeDTO> UpdateEmployeeAsync(Guid id, EmployeeDTO employeeDto)
    {
        var employee = await _unitOfWork.Employees.GetByIdAsync(id);

        if (employee == null)
        {
            throw new KeyNotFoundException("The Employee you are trying to update does not exist.");
        }

        var existingEmployee = await _unitOfWork.Employees.GetByFullNameAsync(employeeDto.FullName);

        if (existingEmployee != null && existingEmployee.Id != id)
        {
            throw new InvalidOperationException($"An employee with the name '{employeeDto.FullName}' already exists.");
        }

        _mapper.Map(employeeDto, employee);
        _unitOfWork.Employees.Update(employee);
        await _unitOfWork.CompleteAsync();
        return _mapper.Map<EmployeeDTO>(employee);
    }

    public async Task DeleteEmployeeAsync(Guid id)
    {
        if (await _unitOfWork.Employees.IsEmployeeLinkedToAssignmentsAsync(id))
            throw new InvalidOperationException("Cannot delete employee as they are linked to assignments.");

        var employee = await _unitOfWork.Employees.GetByIdAsync(id);

        if (employee == null)
        {
            throw new KeyNotFoundException("The Employee you are trying to delete does not exist.");
        }

        _unitOfWork.Employees.Remove(employee);
        await _unitOfWork.CompleteAsync();
    }
}