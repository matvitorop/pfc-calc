using project_server.Models;

namespace project_server.Interfaces
{
    public interface IDaysRepository
    {
        Task<DaysModel> AddDayAsync (DaysModel daysModel);
        Task<DaysModel?> GetDayAsync(int userId, DateTime day);
        Task<DaysModel> ChangeMeasurementDayAsync(int id, double measurement);
        Task<DaysModel> DeleteDayAsync(int id);
    }
}
