using System.Diagnostics.Metrics;
using project_server.Models;
using project_server.Repositories.Day;
using project_server.Repositories.Item;
using project_server.Repositories_part;
using project_server.Schemas;

namespace project_server.Services
{
    public class DaysServise : IDaysServise
    {
        private readonly IUserRepository _userRepo;
        private readonly IItemsRepository _itemRepo;
        private readonly IDaysRepository _daysRepo;
        private readonly IItemService _itemService;

        public DaysServise(IUserRepository userRepository, IItemsRepository itemRepository, IDaysRepository daysRepository, IItemService itemService)
        {
            _userRepo = userRepository;
            _itemRepo = itemRepository;
            _daysRepo = daysRepository;
            _itemService = itemService;
        }

        public async Task<Days?> AddItemForDayAsync(int userId, DateTime day, int? mealTypeId, Items item, double measuremant)
        {
            try
            {
                if (day.Date != DateTime.UtcNow.Date)
                {
                    return null;
                }

                if (!string.IsNullOrEmpty(item.ApiId))
                {
                    var isItemInDB = await _itemRepo.GetItemByApiIdAsync(item.ApiId);
                    if (isItemInDB != null)
                    {
                         await _itemRepo.AddItemAsync(item);
                         await _itemService.AddItemAsync(item);
                    }
                }

                if (item.Id > 0)
                {
                    var daysModel = new Days
                    {
                        UserId = userId,
                        Day = day.Date,
                        MealTypeId = mealTypeId,
                        ItemId = item.Id,
                        Measurement = measuremant
                    };
                    var addedItemForDays = await _daysRepo.AddDayAsync(daysModel);
                    return addedItemForDays;
                }
                return null;
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        public async Task<Days?> ChangeMesurementAsync(int id, double measurement)
        {
            try
            {
                if (id < 1 && measurement < 1)
                {
                    return null;
                }

                return await _daysRepo.ChangeMeasurementDayAsync(id, measurement);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        public async Task<Days?> DeleteItemFromDayAsync(int id)
        {
            try
            {
                if (id < 1)
                {
                    return null;
                }

                return await _daysRepo.DeleteDayAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }
    }
}