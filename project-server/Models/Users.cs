namespace project_server.Models_part
{
    public class Users
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string HashPass { get; set; }
        public string Username { get; set; }
        public string Salt { get; set; }
        public DateTime Age { get; set; }

        public float Weight { get; set; }

        public float Height { get; set; }

        public int? VisitsStreak { get; set; }

        public int ActivityCoefId { get; set; }

        public int DietId { get; set; }

        public int CaloriesStandard { get; set; }
    }
}
