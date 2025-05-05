using Application.DTOs;
using FluentValidation.TestHelper;

public class CreateAssignmentDTOValidatorTests
{
    private readonly CreateAssignmentDTOValidator _validator;

    public CreateAssignmentDTOValidatorTests()
    {
        _validator = new CreateAssignmentDTOValidator();
    }

    [Fact]
    public void Validate_ValidCreateAssignmentDTO_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var createAssignment = new CreateAssignmentDTO
        {
            Title = "Test Assignment",
            Description = "Test Description",
            EmployeeId = Guid.NewGuid(),
            StatusId = Guid.NewGuid(),
            CategoryIds = new List<Guid> { Guid.NewGuid() }
        };

        // Act
        var result = _validator.TestValidate(createAssignment);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_MissingTitle_ShouldHaveValidationError()
    {
        // Arrange
        var createAssignment = new CreateAssignmentDTO
        {
            Description = "Test Description",
            EmployeeId = Guid.NewGuid(),
            StatusId = Guid.NewGuid(),
            CategoryIds = new List<Guid> { Guid.NewGuid() }
        };

        // Act
        var result = _validator.TestValidate(createAssignment);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_EmptyCategoryIds_ShouldHaveValidationError()
    {
        // Arrange
        var createAssignment = new CreateAssignmentDTO
        {
            Title = "Test Assignment",
            Description = "Test Description",
            EmployeeId = Guid.NewGuid(),
            StatusId = Guid.NewGuid(),
            CategoryIds = new List<Guid>()
        };

        // Act
        var result = _validator.TestValidate(createAssignment);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.CategoryIds);
    }
}