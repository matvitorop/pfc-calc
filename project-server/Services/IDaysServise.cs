using System.Security.Cryptography.X509Certificates;
using project_server.Models;
using project_server.Schemas;

namespace project_server.Services
{
    public interface IDaysServise
    {
        public Task<Days?> AddItemForDayAsync(int userId, DateTime day, int? mealTypeId, Items item, double measuremant);
        public Task<Days?> ChangeMesurementAsync(int id, double measurement);
        public Task<Days?> DeleteItemFromDayAsync(int id);
    }
}
