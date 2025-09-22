using System.Data;
using Dapper;
using project_server.Repositories;
using project_server.Models;
using project_server.Interfaces;
namespace project_server.Services
{
    public class ItemService: IItemService
    {
        private readonly IItemCaloriesRepository _itemCaloriesRepository;
        public ItemService(IItemCaloriesRepository itemCaloriesRepository)
        {
            _itemCaloriesRepository=itemCaloriesRepository;
        }
        public double CalculateCalories(double carbs, double proteins, double fats)
        {
            var result = (proteins * 4) + (fats * 9) + (carbs * 4);
            return result;
        }

        public async Task <ItemCaloriesModel> AddItemAsync(ItemCaloriesModel item, ItemsModel items)
        {
            item.Calories = CalculateCalories(items.Carbs, items.Proteins, items.Fats);
            return await _itemCaloriesRepository.AddItemAsync(item);
        }
    }
}
