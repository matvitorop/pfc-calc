namespace project_server.Models_part
{
    public class Notes
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = null!; //hmm
        public DateTime? DueDate { get; set; } //'d better allow nullable 
        public bool IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; } //added nullable
    }
}
