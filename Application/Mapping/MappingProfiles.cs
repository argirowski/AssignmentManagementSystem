using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<CreateCategoryDTO, Category>();

            CreateMap<Status, StatusDTO>().ReverseMap();
            CreateMap<CreateStatusDTO, Status>();

            CreateMap<Employee, EmployeeDTO>().ReverseMap();
        }
    }
}
