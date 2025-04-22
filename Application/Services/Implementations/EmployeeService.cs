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
        return _mapper.Map<EmployeeDTO>(employee);
    }

    public async Task<EmployeeDTO> CreateEmployeeAsync(CreateEmployeeDTO createEmployeeDTO)
    {
        var employee = _mapper.Map<Employee>(createEmployeeDTO);
        employee.Id = Guid.NewGuid(); // Automatically generate the ID
        await _unitOfWork.Employees.AddAsync(employee);
        await _unitOfWork.CompleteAsync();
        return _mapper.Map<EmployeeDTO>(employee);
    }

    public async Task<EmployeeDTO> UpdateEmployeeAsync(Guid id, EmployeeDTO employeeDto)
    {
        var employee = await _unitOfWork.Employees.GetByIdAsync(id);
        if (employee == null) throw new KeyNotFoundException("Employee not found");

        _mapper.Map(employeeDto, employee);
        _unitOfWork.Employees.Update(employee);
        await _unitOfWork.CompleteAsync();
        return _mapper.Map<EmployeeDTO>(employee);
    }

    public async Task DeleteEmployeeAsync(Guid id)
    {
        var employee = await _unitOfWork.Employees.GetByIdAsync(id);
        if (employee == null) throw new KeyNotFoundException("Employee not found");

        _unitOfWork.Employees.Remove(employee);
        await _unitOfWork.CompleteAsync();
    }
}