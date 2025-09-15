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
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = @"INSERT INTO Meal_Types (user_id, name)
                        OUTPUT INSERTED.*
                        VALUES (@UserId, @Name)";

            return await db.QuerySingleOrDefaultAsync<MealTypes>(sql, new { UserId = userId, Name = name });

        }

        public async Task<IEnumerable<MealTypes>> GetById(int id)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = "SELECT * FROM Meal_Types WHERE user_id = @UserId";

            return await db.QueryAsync<MealTypes>(sql, new { UserId = id }); ;
        }
    }
}