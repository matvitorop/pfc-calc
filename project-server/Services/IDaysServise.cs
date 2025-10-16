using System.Security.Cryptography.X509Certificates;
using project_server.Models;
using project_server.Schemas;

namespace project_server.Services
{
    public interface IDaysServise
    {
        public Task<Items?> AddItemForDayAsync(int userId, DateTime day, int? mealTypeId, Items item, double measuremant);
    }
}
