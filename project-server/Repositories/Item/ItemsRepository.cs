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
                SELECT i.id, i.name
                FROM Items i
                LEFT JOIN HiddenItems h
                    ON h.item_id = i.id AND h.user_id = @UserId
                WHERE 
                    i.name LIKE '%' + @PartialName + '%'
                    AND i.user_id = @UserId
                    AND (h.isHidden IS NULL OR h.isHidden = 0)
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

        public async Task<bool> HideItemAsync(int itemId, int userId)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = @"
                MERGE HiddenItems AS target
                USING (SELECT @ItemId AS item_id, @UserId AS user_id) AS source
                ON target.item_id = source.item_id AND target.user_id = source.user_id
                WHEN MATCHED THEN
                    UPDATE SET isHidden = 1
                WHEN NOT MATCHED THEN
                    INSERT (item_id, user_id, isHidden)
                    VALUES (@ItemId, @UserId, 1);
                ";

            var affected = await db.ExecuteAsync(sql, new { ItemId = itemId, UserId = userId });
            return affected > 0;
        }
    }

}