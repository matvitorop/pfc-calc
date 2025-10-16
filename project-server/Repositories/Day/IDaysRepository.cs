using project_server.Models;

namespace project_server.Repositories.Day
{
    public interface IDaysRepository
    {
        Task<Days> AddDayAsync (Days daysModel);
        Task<Days?> GetDayAsync(int userId, DateTime day);
        Task<Days?> ChangeMeasurementDayAsync(int id, double measurement);
        Task<Days?> DeleteDayAsync(int id);
        Task<IEnumerable<Days?>> GetDaysAsync(int userId, DateTime? day = null, int? limit = null);
    }
}
