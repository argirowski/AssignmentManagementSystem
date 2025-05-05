using Application.DTOs;
using FluentValidation.TestHelper;

public class AssignmentDTOValidatorTests
{
    private readonly AssignmentDTOValidator _validator;

    public AssignmentDTOValidatorTests()
    {
        _validator = new AssignmentDTOValidator();
    }

    [Fact]
    public void Validate_ValidAssignmentDTO_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var assignment = new AssignmentDTO
        {
            Title = "Test Assignment",
            Description = "Test Description",
            Employee = new EmployeeDTO { Id = Guid.NewGuid(), FullName = "John Doe", Email = "john.doe@example.com" },
            Status = new StatusDTO { Id = Guid.NewGuid(), Description = "In Progress" },
            Categories = new List<CategoryDTO> { new CategoryDTO { Id = Guid.NewGuid(), Name = "Category 1" } }
        };

        // Act
        var result = _validator.TestValidate(assignment);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_MissingTitle_ShouldHaveValidationError()
    {
        // Arrange
        var assignment = new AssignmentDTO
        {
            Title = null, // Explicitly set Title to null to test missing title validation
            Description = "Test Description",
            Employee = new EmployeeDTO { Id = Guid.NewGuid(), FullName = "John Doe", Email = "john.doe@example.com" },
            Status = new StatusDTO { Id = Guid.NewGuid(), Description = "In Progress" },
            Categories = new List<CategoryDTO> { new CategoryDTO { Id = Guid.NewGuid(), Name = "Category 1" } }
        };

        // Act
        var result = _validator.TestValidate(assignment);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_NullEmployee_ShouldHaveValidationError()
    {
        // Arrange
        var assignment = new AssignmentDTO
        {
            Title = "Test Assignment",
            Description = "Test Description",
            Employee = null,
            Status = new StatusDTO { Id = Guid.NewGuid(), Description = "In Progress" },
            Categories = new List<CategoryDTO> { new CategoryDTO { Id = Guid.NewGuid(), Name = "Category 1" } }
        };

        // Act
        var result = _validator.TestValidate(assignment);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Employee);
    }
}