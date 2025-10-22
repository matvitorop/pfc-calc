using project_server.Models;

namespace project_server.Services
{
    public interface IDaysService
    {
        public Task<IEnumerable<UserDayItemDTO>> GetUserSummaryAsync(int userId, DateTime day);
    }
}
