using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;
using project_server.Models_part;
using System.Data;

namespace project_server.Repositories.Item
{
    public class ItemsRepository : IItemsRepository
    {
        private readonly string _connectionString;

        public ItemsRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<Items> AddItemAsync(Items items)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = @"INSERT INTO Items (user_id, name, proteins, fats, carbs, description, api_id)
                        OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.name, INSERTED.proteins, INSERTED.fats, INSERTED.carbs, INSERTED.description, INSERTED.api_id
                    VALUES (@UserId, @Name, @Proteins, @Fats, @Carbs, @Description, @ApiId)";
            
            return await db.QuerySingleAsync<Items>(sql, items);
        }

        public async Task<Items?> GetItemAsync(string name, int userId)
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM Items WHERE name = @Name AND user_id = @UserId";
            var gotItem = await db.QueryFirstOrDefaultAsync<Items>(sql, new { Name = name, UserId = userId });

            return gotItem ?? null;
        }


        public async Task<Items?> GetItemByApiIdAsync(string apiId)
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM Items WHERE api_id = @ApiId";
            var result = await db.QueryFirstOrDefaultAsync<Items>(sql, new { ApiId = apiId });

            return result ?? null;
        }

        public async Task<Items> ChangeItemAsync(int itemId, string? apiId, int userId, string name, double proteins, double fats, double carbs, string? description)
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            var sql = @"UPDATE Items 
                    SET api_id = @ApiId, user_id = @UserId, name = @Name, proteins = @Proteins, fats = @Fats, carbs = @Carbs, description = @Description 
                    OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.name, INSERTED.proteins, INSERTED.fats, INSERTED.carbs, INSERTED.description, INSERTED.api_id
                    WHERE id = @ItemId AND user_id = @UserId AND api_id IS NULL";
            var changeItem = await db.QueryFirstOrDefaultAsync<Items>(sql, new { ApiId = apiId, UserId = userId, Name = name, Proteins = proteins, Fats = fats, Carbs = carbs, Description = description, ItemId = itemId });
            
            return changeItem ?? new Items
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

        public async Task<IEnumerable<ItemShortDTO>> SearchItemsByNameAsync(string partialName, int userId)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = @"
                SELECT id, name
                FROM Items
                WHERE name LIKE '%' + @PartialName + '%' AND user_id = @UserId
                ";
            var items = await db.QueryAsync<ItemShortDTO>(sql, new { PartialName = partialName, UserId = userId });
            return items;
        }

        public async Task<Items?> GetItemByIdAsync(int itemId)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = "SELECT * FROM Items WHERE id = @ItemId";

            return await db.QuerySingleOrDefaultAsync<Items>(sql, new { ItemId = itemId });
        }

        public async Task<ExtendedItemDTO?> GetUserItemByIdAsync(int itemId, int userId)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = @"
                SELECT 
                    i.*, 
                    ic.calories AS Calories
                FROM 
                    Items i
                LEFT JOIN 
                    ItemCalories ic ON i.id = ic.item_id
                WHERE 
                    i.id = @ItemId AND i.user_id = @UserId";

            return await db.QuerySingleOrDefaultAsync<ExtendedItemDTO>(sql, new { ItemId = itemId, UserId = userId });
        }
    }

}