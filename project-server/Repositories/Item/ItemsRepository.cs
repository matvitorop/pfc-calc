using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;
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
                WHERE name LIKE '%' + @PartialName + '%'
                ";
            var items = await db.QueryAsync<ItemShortDTO>(sql, new { PartialName = partialName });
            return items;
        }

        public Task<Items?> GetItemByIdAsync(int itemId)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = "SELECT * FROM Items WHERE id IN @ItemId";

            return db.QuerySingleOrDefaultAsync<Items>(sql, new { ItemId = itemId });
        }
    }

}