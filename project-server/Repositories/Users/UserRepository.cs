using project_server.Models_part;
using System.Security.Cryptography;
using System.Text;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using project_server.Models;
using System.Diagnostics;

namespace project_server.Repositories_part
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<Users?> CreateAsync(string email, string hashPassword, string username, string salt, DateTime age, float weight, float height,int visitsStreak, int activityCoefId,int dietId,int caloriesStandard)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var exist = await db.QueryFirstOrDefaultAsync<int>(
                "SELECT COUNT(1) FROM Users WHERE email = @Email",
                new { Email = email });

            if (exist > 0) return null;

            var sql = @"
            INSERT INTO Users(email, hash_pass, username, salt, age, weight, height, visits_streak, activity_coef_id, diet_id, calories_standard)
            OUTPUT INSERTED.*
            VALUES(@Email, @HashPass, @Username, @Salt, @Age, @Weight, @Height, @VisitsStreak, @ActivityCoefId, @DietId, @CaloriesStandard)";

            var user = await db.QuerySingleAsync<Users>(sql, new
            {
                Email = email,
                HashPass = hashPassword,
                Username = username,
                Salt = salt,
                Age = age,
                Weight = weight,
                Height = height,
                VisitsStreak = visitsStreak,
                ActivityCoefId = activityCoefId,
                DietId = dietId,
                CaloriesStandard = caloriesStandard
            });

            return user;
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
        public async Task<Users?> GetByEmailAsync(string email)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            return await db.QuerySingleOrDefaultAsync<Users>(
                "SELECT * FROM Users WHERE email = @Email",
                new { Email = email });
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
        public async Task<Users?> UpdatePasswordAsync(int id, string newHash, string newSalt)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

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
        public async Task<Users?> UpdateUserDetailsAsync(int id, string fieldName, object value)
        {
            var allowedFields = new HashSet<string>{
                "age", "weight", "height", "visits_streak", "activity_coef_id", "diet_id" ,"calories_standard"
            };

            if (!allowedFields.Contains(fieldName.ToLower()))
            {
                Debug.WriteLine($" {fieldName} isn`t allowed to update");
                return null;
            }

            using var connection = new SqlConnection(_connectionString);
            string sql = $@"
                UPDATE Users 
                SET {fieldName} = @Value 
                OUTPUT INSERTED.* 
                WHERE id = @Id";

            return await connection.QuerySingleOrDefaultAsync<Users>(sql, new {Value =  value, Id = id });
        }

    }
}