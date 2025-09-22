namespace project_server.Services_part
{
    public interface IAuthService
    {
        string HashPassword(string password, string salt);
        string GenerateSalt();
        bool VerifyPassword(string password, string salt, string hash);
    }
}
