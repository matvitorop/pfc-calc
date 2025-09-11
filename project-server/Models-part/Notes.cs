namespace project_server.Models_part
{
    public class Notes
    {
        public int Id { get; set; }
        public int User_Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime Due_date { get; set; }
        public DateTime Is_completed { get; set; }
        public DateTime Completed_date { get; set; }
    }
}
