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

        public Task<Meal_Types?> CreateAsync(int userId, string name)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = @"INSERT INTO Meal_Types (user_id, name)
                        OUTPUT INSERTED.*
                        VALUES (@UserId, Name)";

            return db.QuerySingleOrDefaultAsync<Meal_Types>(sql, new { UserId = userId, Name = name });

        }

        public Task<IEnumerable<Meal_Types>> GetById(int id)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = "SELECT * FROM Meal_Types WHERE user_id = @UserId";

            var mealTypes = db.QueryAsync<Meal_Types>(sql, new { UserId = id });

            return mealTypes;
        }
    }
}