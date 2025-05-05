using Application.DTOs;
using Application.Validators;
using FluentValidation.TestHelper;

public class CreateStatusDTOValidatorTests
{
    private readonly CreateStatusDTOValidator _validator;

    public CreateStatusDTOValidatorTests()
    {
        _validator = new CreateStatusDTOValidator();
    }

    [Fact]
    public void Validate_ValidCreateStatusDTO_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var createStatus = new CreateStatusDTO
        {
            Description = "Valid Status"
        };

        // Act
        var result = _validator.TestValidate(createStatus);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyDescription_ShouldHaveValidationError()
    {
        // Arrange
        var createStatus = new CreateStatusDTO
        {
            Description = ""
        };

        // Act
        var result = _validator.TestValidate(createStatus);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validate_DescriptionExceedsMaxLength_ShouldHaveValidationError()
    {
        // Arrange
        var createStatus = new CreateStatusDTO
        {
            Description = new string('A', 31) // Exceeds max length of 30
        };

        // Act
        var result = _validator.TestValidate(createStatus);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }
}