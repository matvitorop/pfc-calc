namespace project_server.Models_part
{
    public class Notes
    {
        public int Id { get; set; }
        public int User_Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CompletedDate { get; set; }
    }
}
