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
            return _mapper.Map<AssignmentDTO>(assignment);
        }

        public async Task<AssignmentDTO> CreateAsync(AssignmentDTO assignmentDto)
        {
            var assignment = _mapper.Map<Assignment>(assignmentDto);
            assignment.Id = Guid.NewGuid(); // Automatically generate the ID
            await _unitOfWork.Assignments.AddAsync(assignment);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<AssignmentDTO>(assignment);
        }

        public async Task<AssignmentDTO> UpdateAsync(Guid id, AssignmentDTO assignmentDto)
        {
            var assignment = await _unitOfWork.Assignments.GetByIdAsync(id);
            if (assignment == null) throw new KeyNotFoundException("Assignment not found");

            _mapper.Map(assignmentDto, assignment);
            _unitOfWork.Assignments.Update(assignment);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<AssignmentDTO>(assignment);
        }

        public async Task DeleteAsync(Guid id)
        {
            var assignment = await _unitOfWork.Assignments.GetByIdAsync(id);
            if (assignment == null) throw new KeyNotFoundException("Assignment not found");

            _unitOfWork.Assignments.Remove(assignment);
            await _unitOfWork.CompleteAsync();
        }
    }