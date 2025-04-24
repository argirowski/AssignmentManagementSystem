using Application.DTOs;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services.Implementations
{
    public class StatusService : IStatusService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StatusService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<StatusDTO>> GetAllStatusesAsync()
        {
            var statuses = await _unitOfWork.Statuses.GetAllAsync();
            return _mapper.Map<IEnumerable<StatusDTO>>(statuses);
        }

        public async Task<StatusDTO?> GetStatusByIdAsync(Guid id)
        {
            var status = await _unitOfWork.Statuses.GetByIdAsync(id);

            if (status == null)
            {
                throw new KeyNotFoundException("No such Status exists.");
            }

            return _mapper.Map<StatusDTO?>(status);
        }

        public async Task CreateStatusAsync(CreateStatusDTO createStatusDTO)
        {
            var existingStatus = await _unitOfWork.Statuses.GetByDescriptionAsync(createStatusDTO.Description);

            if (existingStatus != null)
            {
                throw new InvalidOperationException($"A status with the description '{createStatusDTO.Description}' already exists.");
            }

            var status = _mapper.Map<Status>(createStatusDTO);
            status.Id = Guid.NewGuid(); // Automatically generate the ID

            await _unitOfWork.Statuses.AddAsync(status);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateStatusAsync(Guid id, StatusDTO statusDTO)
        {
            var status = await _unitOfWork.Statuses.GetByIdAsync(id);

            if (status == null)
            {
                throw new KeyNotFoundException("Status not found");
            }

            var existingStatus = await _unitOfWork.Statuses.GetByDescriptionAsync(statusDTO.Description);

            if (existingStatus != null && existingStatus.Id != id)
            {
                throw new InvalidOperationException($"A status with the description '{statusDTO.Description}' already exists.");
            }

            _mapper.Map(statusDTO, status);

            await _unitOfWork.Statuses.UpdateAsync(status);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteStatusAsync(Guid id)
        {
            if (await _unitOfWork.Statuses.IsStatusLinkedToAssignmentsAsync(id))
            {
                throw new InvalidOperationException("You cannot delete this status because it is linked to assignments.");
            }

            var status = await _unitOfWork.Statuses.GetByIdAsync(id);

            if (status == null)
            {
                throw new KeyNotFoundException("The Status you are trying to delete does not exist.");
            }

            await _unitOfWork.Statuses.DeleteAsync(id);
            await _unitOfWork.CompleteAsync();
        }
    }
}