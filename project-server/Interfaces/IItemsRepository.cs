using project_server.Models;

namespace project_server.Interfaces
{
    public interface IItemsRepository
    {
        Task<ItemsModel> AddItem(ItemsModel item);
        Task<ItemsModel> GetItem(string name, int userId);
        Task<ItemsModel> ChangeItem(int itemId, string? apiId, int userId, string name, double proteins, double fats, double carbs, string? description);

    }
}
