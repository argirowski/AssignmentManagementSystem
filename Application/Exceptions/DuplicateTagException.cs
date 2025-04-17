namespace Application.Exceptions
{
    public class DuplicateTagException : Exception
    {
        public DuplicateTagException(string name)
            : base($"A tag with the name '{name}' already exists.")
        {
        }
    }
}
