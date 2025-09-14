using Dapper;
using System.Data;
using project_server.Models;
using project_server.Interfaces;

namespace project_server.Repositories
{
    public class ItemCaloriesRepository : IItemCaloriesRepository
    {
        private readonly IDbConnection _db;
        public ItemCaloriesRepository(IDbConnection db)
        {
            _db = db;
        }
        public async Task AddItem(ItemCaloriesModel calories)
        {
            var sql = "INSERT INTO ItemCalories (item_id, calories) VALUES (@ItemId, @Calories)";
            await _db.ExecuteAsync(sql, calories);
        }

        public async Task<ItemCaloriesModel?> GetItem(int itemId)
        {
            var sql = "SELECT * FROM ItemCalories WHERE item_id = @ItemId";
            return await _db.QueryFirstOrDefaultAsync<ItemCaloriesModel>(sql, new { ItemId = itemId });
        }
    }
}
