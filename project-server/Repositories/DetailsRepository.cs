using System.Diagnostics;
using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;

namespace project_server.Repositories
{
    public class DetailsRepository
    {
        private readonly string _connectionString;
        public DetailsRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection-Mycola");
        }

        public async Task<Details?> AddDetailsAsync(Details details)
        {
            using var connection = new SqlConnection(_connectionString);
            string sql = @"
                INSERT INTO Details (user_id, age, weight, height, visits_streak, activity_coef_id, diet_id, calories_standard)
                OUTPUT INSERTED.*, 
            VALUES (@UserId, @Age, @Weight, @Height, @VisitsStreak, @ActivityCoefId, @DietId, @CaloriesStandard);";

            return await connection.QuerySingleOrDefaultAsync<Details>(sql, details);           
        }

        public async Task<Details?> GetDetailsAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            string sql = @"
                SELECT *
                FROM Details
                WHERE user_id = @UserId;";

            return await connection.QuerySingleOrDefaultAsync<Details>(sql, new { UserId = userId });
        }

        public async Task<Details?> UpdateDetailsAsync(int userId, string fieldName, object value)
        {
            var allowedFields = new HashSet<string>{
                "age", "weight", "height", "visits_streak", "activity_coef_id", "diet_id"
            };
            
            if (!allowedFields.Contains(fieldName.ToLower()))
            {
                Debug.WriteLine($" {fieldName} isn`t allowed to update");
                return null;
            }

            using var connection = new SqlConnection(_connectionString);
            string sql = $@"
                UPDATE Details 
                SET {fieldName} = @value 
                OUTPUT INSERTED.* 
                WHERE user_id = @UserId";

            return await connection.QuerySingleOrDefaultAsync<Details>(sql, new { value, UserId = userId });
        }
    }
}

