using project_server.Models;

namespace project_server.Repositories.Item
{
    public interface IItemsRepository
    {
        Task<Items> AddItemAsync(Items item);
        Task<Items?> GetItemAsync(string name, int userId);
        Task<Items> ChangeItemAsync(int itemId, string? apiId, int userId, string name, double proteins, double fats, double carbs, string? description);
        Task<IEnumerable<ItemShortDTO>> SearchItemsByNameAsync(string partialName, int userId);
        Task<Items?> GetItemByIdAsync(int itemIds);

    }
}
