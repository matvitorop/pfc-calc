namespace project_server.Schemas
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public string Message { get; set; }
        public bool Success { get; set; }
    }
}
