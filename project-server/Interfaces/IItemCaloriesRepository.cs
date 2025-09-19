using project_server.Models;

namespace project_server.Interfaces
{
    public interface IItemCaloriesRepository
    {
        Task<ItemCaloriesModel> AddItemAsync(ItemCaloriesModel calories);
        Task<ItemCaloriesModel?> GetItemAsync(int itemId);
    }
}
