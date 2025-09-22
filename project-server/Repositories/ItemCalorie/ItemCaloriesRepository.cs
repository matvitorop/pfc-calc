using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;
using System.Data;

namespace project_server.Repositories.ItemCalorie
{
    public class ItemCaloriesRepository : IItemCaloriesRepository
    {
        private readonly string _connectionString;

        public ItemCaloriesRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }
        public async Task<ItemCalories> AddItemAsync(ItemCalories calories)
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            var sql = "INSERT INTO ItemCalories (item_id, calories) " +
                "OUTPUT INSERTED.id, INSERTED.item_id, INSERTED.calories " +
                "VALUES (@ItemId, @Calories)";
            
            return await db.QuerySingleAsync<ItemCalories>(sql, calories);
        }

        public async Task<ItemCalories?> GetItemAsync(int itemId)
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM ItemCalories WHERE item_id = @ItemId";
            
            return await db.QueryFirstOrDefaultAsync<ItemCalories>(sql, new { ItemId = itemId });
        }
    }
}