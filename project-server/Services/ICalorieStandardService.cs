using project_server.Models_part;

namespace project_server.Services
{
    public interface ICalorieStandardService
    {
        public Task<int> CalculateCalorieStandard(DateTime age, float weight, float height, int coefId, int dietId);
        public  Task<Users> RecalculateCaloriesStandard(Users user);
    }
}
