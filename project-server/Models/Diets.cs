namespace project_server.Models
{
    public class Diets
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }

        public float ProteinPerc { get; set; }

        public float FatsPerc { get; set; }

        public float CarbsPerc { get; set; }

       
    }
}
