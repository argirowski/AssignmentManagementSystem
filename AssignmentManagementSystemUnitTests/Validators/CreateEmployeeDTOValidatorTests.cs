using Application.DTOs;
using Application.Validators;
using FluentValidation.TestHelper;

public class CreateEmployeeDTOValidatorTests
{
    private readonly CreateEmployeeDTOValidator _validator;

    public CreateEmployeeDTOValidatorTests()
    {
        _validator = new CreateEmployeeDTOValidator();
    }

    [Fact]
    public void Validate_ValidCreateEmployeeDTO_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var createEmployee = new CreateEmployeeDTO
        {
            FullName = "John Doe",
            Email = "johndoe@example.com"
        };

        // Act
        var result = _validator.TestValidate(createEmployee);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyFullName_ShouldHaveValidationError()
    {
        // Arrange
        var createEmployee = new CreateEmployeeDTO
        {
            FullName = "",
            Email = "johndoe@example.com"
        };

        // Act
        var result = _validator.TestValidate(createEmployee);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.FullName);
    }

    [Fact]
    public void Validate_InvalidEmail_ShouldHaveValidationError()
    {
        // Arrange
        var createEmployee = new CreateEmployeeDTO
        {
            FullName = "John Doe",
            Email = "invalid-email"
        };

        // Act
        var result = _validator.TestValidate(createEmployee);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }
}