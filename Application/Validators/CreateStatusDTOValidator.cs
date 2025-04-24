using FluentValidation;
using Application.DTOs;

namespace Application.Validators
{
    public class CreateStatusDTOValidator : AbstractValidator<CreateStatusDTO>
    {
        public CreateStatusDTOValidator()
        {
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(30).WithMessage("Description cannot exceed 30 characters.");
        }
    }
}