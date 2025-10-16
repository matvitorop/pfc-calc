using project_server.Models;

namespace project_server.Services
{
    public interface IStreakService
    {
        Task<int?> ChangeCounterAsync(string email, IEnumerable<Days>? recentDays = null);
        Task<int?> CheckForStreakResetAsync(string email, IEnumerable<Days>? recentDays = null);
    }
}
