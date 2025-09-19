using project_server.Models;

namespace project_server.Interfaces
{
    public interface IItemsRepository
    {
        Task<ItemsModel> AddItemAsync(ItemsModel item);
        Task<ItemsModel> GetItemAsync(string name, int userId);
        Task<ItemsModel> ChangeItemAsync(int itemId, string? apiId, int userId, string name, double proteins, double fats, double carbs, string? description);

    }
}
