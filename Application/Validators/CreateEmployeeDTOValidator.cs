using FluentValidation;
using Application.DTOs;

namespace Application.Validators
{
    public class CreateEmployeeDTOValidator : AbstractValidator<CreateEmployeeDTO>
    {
        public CreateEmployeeDTOValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required.")
                .MaximumLength(50).WithMessage("Full name cannot exceed 50 characters.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");
        }
    }
}