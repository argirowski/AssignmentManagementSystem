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
            CreateMap<CreateEmployeeDTO, Employee>();

            CreateMap<Assignment, AssignmentDTO>().ReverseMap();

            CreateMap<Assignment, AssignmentDTO>()
                .ForMember(dest => dest.Employee, opt => opt.MapFrom(src => src.Employee))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.AssignmentCategories.Select(ac => ac.Category)));

            CreateMap<CreateAssignmentDTO, Assignment>()
                .ForMember(dest => dest.Employee, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.AssignmentCategories, opt => opt.Ignore());
        }
    }
}
