namespace project_server.Models
{
    public class HiddenItem
    {
        public int ItemId { get; set; }
        public int UserId { get; set; }
        public bool? IsHidden { get; set; }
    }
}
