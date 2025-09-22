using project_server.Repositories;
using project_server.Models;

namespace project_server.Interfaces
{
    public interface IItemService
    {
        Task<ItemCaloriesModel> AddItemAsync(ItemCaloriesModel item, ItemsModel items); //додав аргумент ще один з моделі
    }
}
