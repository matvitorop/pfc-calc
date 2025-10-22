namespace project_server.Models
{
    public class UserDayItemDTO : Days
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public double Proteins { get; set; }
        public double Fats { get; set; }
        public double Carbs { get; set; }
        public string? Description { get; set; }
        public string? ApiId { get; set; }
        public double Calories { get; set; }
    }
}
