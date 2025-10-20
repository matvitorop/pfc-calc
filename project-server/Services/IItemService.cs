using project_server.Repositories;
using project_server.Models;
using project_server.Schemas;

namespace project_server.Services
{
    public interface IItemService
    {
        Task<ItemCalories> AddItemAsync(ItemCalories item, Items items); //додав аргумент ще один з моделі
        double CalculateCalories(double carbs, double proteins, double fats);
    }
}
