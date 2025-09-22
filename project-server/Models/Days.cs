namespace project_server.Models
{
    public class Days
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime Day { get; set; }
        public int? MealTypeId { get; set; }
        public int ItemId { get; set; }
        public double Measurement { get; set; }
    }
}
