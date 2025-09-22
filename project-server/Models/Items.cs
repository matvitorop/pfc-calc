namespace project_server.Models
{
    public class Items
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Name { get; set; } = null!;
        public double Proteins { get; set; }
        public double Fats { get; set; }
        public double Carbs { get; set; }
        //public ItemCalories ItemCalories { get; set; } = null!;
        public string? Description { get; set; }
        public string? ApiId { get; set; }
    }
}
