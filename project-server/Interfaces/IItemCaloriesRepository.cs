using project_server.Models;

namespace project_server.Interfaces
{
    public interface IItemCaloriesRepository
    {
        Task<ItemCaloriesModel> AddItem(ItemCaloriesModel calories);
        Task<ItemCaloriesModel?> GetItem(int itemId);
    }
}
