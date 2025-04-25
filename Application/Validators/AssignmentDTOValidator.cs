using Application.DTOs;
using FluentValidation;

public class AssignmentDTOValidator : AbstractValidator<AssignmentDTO>
{
    public AssignmentDTOValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
        RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
        RuleFor(x => x.Employee).NotNull().WithMessage("Employee is required.");
        RuleFor(x => x.Status).NotNull().WithMessage("Status is required.");
        RuleForEach(x => x.Categories).NotNull().WithMessage("Categories cannot contain null values.");
    }
}