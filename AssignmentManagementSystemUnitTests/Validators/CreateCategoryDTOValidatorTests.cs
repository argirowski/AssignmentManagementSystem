using Application.DTOs;
using Application.Validators;
using FluentValidation.TestHelper;

public class CreateCategoryDTOValidatorTests
{
    private readonly CreateCategoryDTOValidator _validator;

    public CreateCategoryDTOValidatorTests()
    {
        _validator = new CreateCategoryDTOValidator();
    }

    [Fact]
    public void Validate_ValidCreateCategoryDTO_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var createCategory = new CreateCategoryDTO
        {
            Name = "Valid Category"
        };

        // Act
        var result = _validator.TestValidate(createCategory);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyName_ShouldHaveValidationError()
    {
        // Arrange
        var createCategory = new CreateCategoryDTO
        {
            Name = ""
        };

        // Act
        var result = _validator.TestValidate(createCategory);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_NameExceedsMaxLength_ShouldHaveValidationError()
    {
        // Arrange
        var createCategory = new CreateCategoryDTO
        {
            Name = new string('A', 31) // Exceeds max length of 30
        };

        // Act
        var result = _validator.TestValidate(createCategory);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }
}