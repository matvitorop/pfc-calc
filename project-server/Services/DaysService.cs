using project_server.Models;
using project_server.Repositories.Day;
using project_server.Repositories.Item;
using project_server.Repositories.ItemCalorie;

namespace project_server.Services
{
    public class DaysService : IDaysService
    {
        private readonly IDaysRepository _daysRepository;
        private readonly IItemsRepository _itemsRepository;
        private readonly IItemCaloriesRepository _itemCaloriesRepository;
        public DaysService(IDaysRepository daysRepository, IItemsRepository itemsRepository, IItemCaloriesRepository itemCaloriesRepository)
        {
            _daysRepository = daysRepository;
            _itemsRepository = itemsRepository;
            _itemCaloriesRepository = itemCaloriesRepository;
        }

        public async Task<IEnumerable<UserDayItemDTO>> GetUserSummaryAsync(int userId, DateTime day)
        {
            var days = await _daysRepository.GetDaysAsync(userId, day);
            var userDayItems = new List<UserDayItemDTO>();

            foreach (var d in days)
            {
                var item = await _itemsRepository.GetItemByIdAsync(d!.ItemId);
                var calories = await _itemCaloriesRepository.GetItemAsync(d.ItemId);

                userDayItems.Add(new UserDayItemDTO
                {
                    Id = d.Id,
                    UserId = d.UserId,
                    Day = d.Day,
                    MealTypeId = d.MealTypeId,
                    ItemId = d.ItemId,
                    Measurement = d.Measurement,
                    Name = item?.Name,
                    Proteins = item?.Proteins,
                    Fats = item?.Fats,
                    Carbs = item?.Carbs,
                    Description = item?.Description,
                    ApiId = item?.ApiId,
                    Calories = calories?.Calories
                });
            }

            return userDayItems;
        }
    }
}
