namespace project_server.Models
{
    public class Diets
    {
        public int id { get; set; }
        public string name { get; set; }
        public string? description { get; set; }

        public float protein_perc { get; set; }

        public float fats_perc { get; set; }

        public float carbs_perc { get; set; }

       
    }
}
