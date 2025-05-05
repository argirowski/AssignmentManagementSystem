using Application.DTOs;
using Application.Validators;
using FluentValidation.TestHelper;

public class CategoryDTOValidatorTests
{
    private readonly CategoryDTOValidator _validator;

    public CategoryDTOValidatorTests()
    {
        _validator = new CategoryDTOValidator();
    }

    [Fact]
    public void Validate_ValidCategoryDTO_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var category = new CategoryDTO
        {
            Id = Guid.NewGuid(),
            Name = "Valid Category"
        };

        // Act
        var result = _validator.TestValidate(category);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyName_ShouldHaveValidationError()
    {
        // Arrange
        var category = new CategoryDTO
        {
            Id = Guid.NewGuid(),
            Name = ""
        };

        // Act
        var result = _validator.TestValidate(category);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_NameExceedsMaxLength_ShouldHaveValidationError()
    {
        // Arrange
        var category = new CategoryDTO
        {
            Id = Guid.NewGuid(),
            Name = new string('A', 31) // Exceeds max length of 30
        };

        // Act
        var result = _validator.TestValidate(category);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }
}