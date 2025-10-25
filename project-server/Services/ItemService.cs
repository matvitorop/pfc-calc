using System.Data;
using Dapper;
using project_server.Repositories;
using project_server.Models;
using project_server.Repositories.ItemCalorie;
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
            if (proteins != 0 && fats != 0 && carbs != 0)
            {
                var result = (proteins * 4) + (fats * 9) + (carbs * 4);
                return result;

            }
            else
            {
                throw new ArgumentException("To calculate calories, you need to enter proteins, fats and carbohydrates, or calories directly.");
            }

        }

        // додати обробник помилок
        public async Task <ItemCalories> AddItemAsync(ItemCalories item, Items items) //items можна видалити
        {
//            item.Calories = CalculateCalories(items.Carbs, items.Proteins, items.Fats);
            return await _itemCaloriesRepository.AddItemAsync(item);
        }
    }
}
