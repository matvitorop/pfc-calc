using System.Security.Cryptography;
using System.Text;

namespace project_server.Services_part
{
    public class AuthService : IAuthService
    {
        public string GenerateSalt()
        {
            var bytes = new byte[16];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        public string HashPassword(string password, string salt)
        {
            using var sha256 = SHA256.Create();
            var combined = Encoding.UTF8.GetBytes(password + salt);
            var hash = sha256.ComputeHash(combined);
            return Convert.ToBase64String(hash);
        }

        public bool VerifyPassword(string password, string salt, string hash)
        {
            var hashed = HashPassword(password, salt);
            return hashed == hash;
        }
    }
}
