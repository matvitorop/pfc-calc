using project_server.Models;

namespace project_server.Services
{
    public interface ICounterChangerService
    {
        Task<bool> ChangeCounterAsync(string email, IEnumerable<Days>? recentDays = null);
        Task<bool> CheckForStreakResetAsync(string email, IEnumerable<Days>? recentDays = null);
    }
}
