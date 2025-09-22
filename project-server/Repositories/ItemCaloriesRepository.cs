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
        public async Task<ItemCaloriesModel> AddItemAsync(ItemCaloriesModel calories)
        {
            var sql = "INSERT INTO ItemCalories (item_id, calories) OUTPUT INSERTED.id, INSERTED.item_id, INSERTED.calories VALUES (@ItemId, @Calories)";
            var insertedItem = await _db.QuerySingleAsync<ItemCaloriesModel>(sql, calories);
            return insertedItem;
        }

        public async Task<ItemCaloriesModel?> GetItemAsync(int itemId)
        {
            var sql = "SELECT * FROM ItemCalories WHERE item_id = @ItemId";
            var gotItem = await _db.QueryFirstOrDefaultAsync<ItemCaloriesModel>(sql, new { ItemId = itemId });
            return gotItem;
        }
    }
}
