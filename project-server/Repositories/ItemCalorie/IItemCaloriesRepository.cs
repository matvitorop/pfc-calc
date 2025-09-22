using project_server.Models;

namespace project_server.Repositories.ItemCalorie
{
    public interface IItemCaloriesRepository
    {
        Task<ItemCalories> AddItemAsync(ItemCalories calories);
        Task<ItemCalories?> GetItemAsync(int itemId);
    }
}
