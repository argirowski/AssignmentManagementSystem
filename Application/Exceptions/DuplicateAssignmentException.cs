namespace Application.Exceptions
{
    public class DuplicateAssignmentException : Exception
    {
        public DuplicateAssignmentException(string title)
            : base($"An assignment with the title '{title}' already exists.")
        {
        }
    }
}
