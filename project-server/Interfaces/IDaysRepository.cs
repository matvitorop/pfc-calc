using project_server.Models;

namespace project_server.Interfaces
{
    public interface IDaysRepository
    {
        Task AddDay (DaysModel daysModel);
        Task<DaysModel?> GetDay(int userId, DateTime day);
        Task ChangeMeasurementDay(int id, double measurement);
        Task DeleteDay(int id);
    }
}
