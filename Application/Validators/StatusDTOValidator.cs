using FluentValidation;
using Application.DTOs;

namespace Application.Validators
{
    public class StatusDTOValidator : AbstractValidator<StatusDTO>
    {
        public StatusDTOValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required.")
                .Must(id => Guid.TryParse(id.ToString(), out _)).WithMessage("Id must be a valid GUID.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(30).WithMessage("Description cannot exceed 30 characters.");
        }
    }
}