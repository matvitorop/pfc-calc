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

        public async Task<ItemsModel> AddItemAsync(ItemsModel items)
        {
            var sql = @"INSERT INTO Items (user_id, name, proteins, fats, carbs, description, api_id)
                        OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.name, INSERTED.proteins, INSERTED.fats, INSERTED.carbs, INSERTED.description, INSERTED.api_id
                    VALUES (@UserId, @Name, @Proteins, @Fats, @Carbs, @Description, @ApiId)";
            var insertedItem = await _db.QuerySingleAsync<ItemsModel>(sql, items);
            return insertedItem;
        }

        public async Task<ItemsModel?> GetItemAsync(string name, int userId)
        {
            var sql = "SELECT * FROM Items WHERE name = @Name AND user_id = @UserId";
            var gotItem = await _db.QueryFirstOrDefaultAsync<ItemsModel>(sql, new { Name = name, UserId = userId });
            return gotItem ?? new ItemsModel
            {
                Name = name,
                UserId = userId
            };
        }

        public async Task<ItemsModel> ChangeItemAsync(int itemId, string? apiId, int userId, string name, double proteins, double fats, double carbs, string? description)
        {
            var sql = @"UPDATE Items 
                    SET api_id = @ApiId, user_id = @UserId, name = @Name, proteins = @Proteins, fats = @Fats, carbs = @Carbs, description = @Description 
                    OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.name, INSERTED.proteins, INSERTED.fats, INSERTED.carbs, INSERTED.description, INSERTED.api_id
                    WHERE id = @ItemId AND user_id = @UserId AND api_id IS NULL";
            var changeItem = await _db.QueryFirstOrDefaultAsync<ItemsModel>(sql, new { ApiId = apiId, UserId = userId, Name = name, Proteins = proteins, Fats = fats, Carbs = carbs, Description = description, ItemId = itemId });
            return changeItem ?? new ItemsModel
            {
                Id = itemId,
                UserId = userId,
                Name = name,
                Proteins = proteins,
                Fats = fats,
                Carbs = carbs,
                Description = description,
                ApiId = apiId
            };
        }
    }

}
