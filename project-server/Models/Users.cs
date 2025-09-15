namespace project_server.Models_part
{
    public class Users
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string HashPass { get; set; }
        public string Username { get; set; }
        public string Salt { get; set; }
    }
}
