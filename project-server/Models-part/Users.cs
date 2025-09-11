namespace project_server.Models_part
{
    public class Users
    {
        public int Id { get; set; }
        public string email { get; set; }
        public string hash_pass { get; set; }
        public string username { get; set; }
        public string salt { get; set; }
    }
}
