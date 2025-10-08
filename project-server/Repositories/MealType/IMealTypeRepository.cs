using project_server.Models_part;

namespace project_server.Repositories_part
{
    public interface IMealTypeRepository
    {
        Task<IEnumerable<MealTypes?>> GetByIdAsync(int id);
        Task<MealTypes?> CreateAsync(int userId, string name);
        Task<MealTypes?> DeleteByNameAsync(int userId, string name);
        Task<MealTypes?> DeleteByIdAsync(int userId, int id);
    }
}
