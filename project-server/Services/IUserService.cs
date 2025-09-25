using project_server.Models_part;

namespace project_server.Services_part
{
    public interface IUserService
    {
        Task<Users?> RegisterAsync(string email, string password, string username, DateTime age, float weight, float height, int visitsStreak, int activityCoefId, int dietId, int caloriesStandard);
        Task<Users?> AuthenticateAsync(string email, string password);
        Task<Users?> UpdatePasswordAsync(int id, string newPassword);
        Task<Users?> UpdateUserDetailsAsync(int id, string fieldName, object value);
    }
}
