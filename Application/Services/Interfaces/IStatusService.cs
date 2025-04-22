using Application.DTOs;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IStatusService
    {
        Task<IEnumerable<StatusDTO>> GetAllStatusesAsync();
        Task<StatusDTO?> GetStatusByIdAsync(Guid id);
        Task CreateStatusAsync(CreateStatusDTO createStatusDTO);
        Task UpdateStatusAsync(Guid id, StatusDTO statusDTO);
        Task DeleteStatusAsync(Guid id);
    }
}