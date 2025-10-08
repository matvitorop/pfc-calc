using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models_part;
using System.Data;

namespace project_server.Repositories_part
{
    public class MealTypeRepository : IMealTypeRepository
    {
        private readonly string _connectionString;

        public MealTypeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<MealTypes?> CreateAsync(int userId, string name)
        {
            if (string.Equals(name, "General", StringComparison.OrdinalIgnoreCase))
                return null;

            using IDbConnection db = new SqlConnection(_connectionString);

            var existsSql = @"SELECT COUNT(*) 
                      FROM Meal_Types 
                      WHERE user_id = @UserId AND name = @Name";

            var exists = await db.ExecuteScalarAsync<int>(existsSql, new { UserId = userId, Name = name });
            if (exists > 0)
                return null;

            var sql = @"INSERT INTO Meal_Types (user_id, name)
                        OUTPUT INSERTED.*
                        VALUES (@UserId, @Name)";

            return await db.QuerySingleOrDefaultAsync<MealTypes>(sql, new { UserId = userId, Name = name });
        }

        public async Task<MealTypes?> DeleteByNameAsync(int userId, string name)
        {
            if (string.Equals(name, "General", StringComparison.OrdinalIgnoreCase))
                return null;

            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = "DELETE FROM Meal_Types " +
                "OUTPUT DELETED.*" +
                "WHERE name = @Name AND user_id = @UserId";

            return await db.QuerySingleOrDefaultAsync<MealTypes>(sql, new { Name = name, UserId = userId }); ;
        }

        public async Task<IEnumerable<MealTypes?>> GetByIdAsync(int id)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = "SELECT * FROM Meal_Types WHERE user_id = @UserId";

            return await db.QueryAsync<MealTypes>(sql, new { UserId = id }); ;
        }

        public async Task<MealTypes?> DeleteByIdAsync(int userId, int id)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = "DELETE FROM Meal_Types " +
                "OUTPUT DELETED.*" +
                "WHERE id = @Id AND user_id = @UserId";

            return await db.QuerySingleOrDefaultAsync<MealTypes>(sql, new { Id = id, UserId = userId }); ;
        }
    }
}