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
    }
}
/*
 
 id INT IDENTITY PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    age INT NOT NULL,
    weight FLOAT NOT NULL,
    height FLOAT NOT NULL,
    days_of_activity INT DEFAULT 0,
    last_activity_date DATE,
    activity_coef_id INT,
    diet_id INT,

 
 
 */