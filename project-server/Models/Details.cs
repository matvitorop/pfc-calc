namespace project_server.Models
{
    public class Details
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime Age { get; set; }

        public float Weight { get; set; }

        public float Height { get; set; }

        public int VisitsStreak { get; set; }

        public int ActivityCoefId { get; set; }

        public int  DietId { get; set; }

        public int CaloriesStandard { get; set; }
    }
}
