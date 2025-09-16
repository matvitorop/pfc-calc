namespace project_server.Models
{
    public class Details
    {
        public int id { get; set; }
        public int? user_id { get; set; }
        public DateTime age { get; set; }

        public float weight { get; set; }

        public float height { get; set; }

        public int visits_streak { get; set; }

        public int activity_coef_id { get; set; }

        public int  diet_id { get; set; }
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