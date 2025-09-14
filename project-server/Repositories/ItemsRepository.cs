using project_server.Models;
using static project_server.Repositories.ItemsRepository;
using System.Data;
using Dapper;
using project_server.Models;
using project_server.Interfaces;

namespace project_server.Repositories
{
    public class ItemsRepository : IItemsRepository
    {
        private readonly IDbConnection _db;

        public ItemsRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task AddItem(ItemsModel items)
        {
            var sql = @"INSERT INTO Items (user_id, name, proteins, fats, carbs, description, is_api, api_id)
                    VALUES (@UserId, @Name, @Proteins, @Fats, @Carbs, @Description, @IsApi, @ApiId)";
            await _db.ExecuteAsync(sql, items);
        }

        public async Task<ItemsModel?> GetItem(string name, int userId)
        {
            var sql = "SELECT * FROM Items WHERE name = @Name AND user_id = @UserId";
            return await _db.QueryFirstOrDefaultAsync<ItemsModel>(sql, new { Name = name, UserId = userId });
        }

        public async Task ChangeItem(int itemId, string? apiId, int userId, string name, double proteins, double fats, double carbs, string? description)
        {
            var sql = @"UPDATE Items 
                    SET api_id = @ApiId, user_id = @UserId, name = @Name, proteins = @Proteins, fats = @Fats, carbs = @Carbs, description = @Description
                    WHERE id = @ItemId AND user_id = @UserId AND api_id IS NULL";
            await _db.ExecuteAsync(sql, new { ApiId = apiId, UserId = userId, Name = name, Proteins = proteins, Fats = fats, Carbs = carbs, Description = description, ItemId = itemId });
        }
    }

}
