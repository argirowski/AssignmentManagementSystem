using Application.DTOs;
using Application.Validators;
using FluentValidation.TestHelper;

public class EmployeeDTOValidatorTests
{
    private readonly EmployeeDTOValidator _validator;

    public EmployeeDTOValidatorTests()
    {
        _validator = new EmployeeDTOValidator();
    }

    [Fact]
    public void Validate_ValidEmployeeDTO_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var employee = new EmployeeDTO
        {
            Id = Guid.NewGuid(),
            FullName = "John Doe",
            Email = "johndoe@example.com"
        };

        // Act
        var result = _validator.TestValidate(employee);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyId_ShouldHaveValidationError()
    {
        // Arrange
        var employee = new EmployeeDTO
        {
            Id = Guid.Empty,
            FullName = "John Doe",
            Email = "johndoe@example.com"
        };

        // Act
        var result = _validator.TestValidate(employee);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Id);
    }

    [Fact]
    public void Validate_InvalidEmail_ShouldHaveValidationError()
    {
        // Arrange
        var employee = new EmployeeDTO
        {
            Id = Guid.NewGuid(),
            FullName = "John Doe",
            Email = "invalid-email"
        };

        // Act
        var result = _validator.TestValidate(employee);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }
}