using project_server.Models_part;
using System.Security.Cryptography;
using System.Text;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace project_server.Repositories_part
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }
        private static string HashPassword(string password, string salt)
        {
            using var sha256 = SHA256.Create();
            var combined = Encoding.UTF8.GetBytes(password + salt);
            var hash = sha256.ComputeHash(combined);
            return Convert.ToBase64String(hash);
        }

        private static string GenerateSalt()
        {
            var bytes = new byte[16];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        public async Task<Users?> CreateAsync(string email, string password, string username)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var exist = await db.QueryFirstOrDefaultAsync<int>(
                "SELECT COUNT(1) FROM Users WHERE email = @Email",
                new { Email = email });

            if (exist > 0) return null;

            var salt = GenerateSalt();
            var hashPass = HashPassword(password, salt);

            var sql = @"
            INSERT INTO Users(email, hash_pass, username, salt)
            OUTPUT INSERTED.*
            VALUES(@Email, @HashPass, @Username, @Salt)";

            var user = await db.QuerySingleAsync<Users>(sql, new
            {
                Email = email,
                HashPass = hashPass,
                Username = username,
                Salt = salt
            });

            return user;
        }
        
        public async Task<Users?> AuthenticaеteAsync(string email, string password)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var user = await db.QueryFirstOrDefaultAsync<Users>(
                "SELECT * FROM Users WHERE email = @Email",
                new { Email = email });

            if (user == null) return null;

            var passwordHash = HashPassword(password, user.Salt);

            return passwordHash == user.Hash_pass ? user : null;
        }

        public async Task<Users?> DeleteAsync(int id)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = @"
            DELETE FROM Users
            OUTPUT DELETED.*
            WHERE id = @Id";

            return await db.QueryFirstOrDefaultAsync<Users>(sql, new { Id = id });
        }

        public async Task<Users?> UpdateEmailAsync(int id, string newEmail)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var exists = await db.QueryFirstOrDefaultAsync<int>(
            "SELECT COUNT(1) FROM Users WHERE email = @Email AND id != @Id",
            new { Email = newEmail, Id = id });

            if (exists > 0) return null;

            var sql = @"
            UPDATE Users
            SET email = @Email
            OUTPUT INSERTED.*
            WHERE id = @Id;";

            return await db.QueryFirstOrDefaultAsync<Users>(sql, new { Email = newEmail, Id = id });
        }

        public async Task<Users?> UpdateUsernameAsync(int id, string newUsername)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = @"
            UPDATE Users
            SET username = @Username
            OUTPUT INSERTED.*
            WHERE id = @Id;";

            return await db.QueryFirstOrDefaultAsync<Users>(sql, new { Username = newUsername, Id = id });
        }

        public async Task<Users?> UpdatePasswordAsync(int id, string newPassword)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var newSalt = GenerateSalt();
            var newHash = HashPassword(newPassword, newSalt);

            var sql = @"
            UPDATE Users
            SET hash_pass = @HashPass, salt = @Salt
            OUTPUT INSERTED.*
            WHERE id = @Id;";

            return await db.QueryFirstOrDefaultAsync<Users>(sql, new
            {
                HashPass = newHash,
                Salt = newSalt,
                Id = id
            });
        }
    }
}