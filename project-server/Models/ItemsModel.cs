namespace project_server.Models
{
    public class ItemsModel
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Name { get; set; }
        public double Proteins { get; set; }
        public double Fats { get; set; }
        public double Carbs { get; set; }
//        public double Calories { get; set; }
        public ItemCaloriesModel ItemCalories { get; set; }
        public string? Description { get; set; }

        public bool IsApi { get; set; }
        public string? ApiId { get; set; }
    }
}
