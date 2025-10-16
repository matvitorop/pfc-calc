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

        public DaysServise(IUserRepository userRepository, ItemsRepository itemRepository,IDaysRepository daysRepository)
        {
            _userRepo = userRepository;
            _itemRepo = itemRepository;
            _daysRepo = daysRepository;
        }


        public async Task<Items?> AddItemForDayAsync(int userId, DateTime day, int? mealTypeId, Items item, double measuremant)
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
                    if (isItemInDB != null) {

                        var addedItem = await _itemRepo.AddItemAsync(item);
                        
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

                    var addedItemForDays = _daysRepo.AddDayAsync(daysModel);
                }

                return item;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null; 
            }

        }
    }
}
