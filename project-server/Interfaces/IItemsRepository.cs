using project_server.Models;

namespace project_server.Interfaces
{
    public interface IItemsRepository
    {
        Task AddItem(ItemsModel item);
        Task<ItemsModel?> GetItem(string name, int userId);
        Task ChangeItem(int itemId, string? apiId, int userId, string name, double proteins, double fats, double carbs, string? description);

    }
}
