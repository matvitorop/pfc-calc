using project_server.Models;

namespace project_server.Interfaces
{
    public interface IDaysRepository
    {
        Task<DaysModel> AddDay (DaysModel daysModel);
        Task<DaysModel?> GetDay(int userId, DateTime day);
        Task<DaysModel> ChangeMeasurementDay(int id, double measurement);
        Task<DaysModel> DeleteDay(int id);
    }
}
