using Application.DTOs;
using Application.Validators;
using FluentValidation.TestHelper;

public class StatusDTOValidatorTests
{
    private readonly StatusDTOValidator _validator;

    public StatusDTOValidatorTests()
    {
        _validator = new StatusDTOValidator();
    }

    [Fact]
    public void Validate_ValidStatusDTO_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var status = new StatusDTO
        {
            Id = Guid.NewGuid(),
            Description = "Valid Status"
        };

        // Act
        var result = _validator.TestValidate(status);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyId_ShouldHaveValidationError()
    {
        // Arrange
        var status = new StatusDTO
        {
            Id = Guid.Empty,
            Description = "Valid Status"
        };

        // Act
        var result = _validator.TestValidate(status);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Id);
    }

    [Fact]
    public void Validate_DescriptionExceedsMaxLength_ShouldHaveValidationError()
    {
        // Arrange
        var status = new StatusDTO
        {
            Id = Guid.NewGuid(),
            Description = new string('A', 31) // Exceeds max length of 30
        };

        // Act
        var result = _validator.TestValidate(status);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }
}