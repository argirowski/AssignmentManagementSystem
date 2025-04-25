using FluentValidation;

public class CreateAssignmentDTOValidator : AbstractValidator<CreateAssignmentDTO>
{
    public CreateAssignmentDTOValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
        RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
        RuleFor(x => x.EmployeeId).NotEmpty().WithMessage("Employee ID is required.");
        RuleFor(x => x.StatusId).NotEmpty().WithMessage("Status ID is required.");
        RuleForEach(x => x.CategoryIds).NotEmpty().WithMessage("Category IDs cannot contain empty values.");
    }
}