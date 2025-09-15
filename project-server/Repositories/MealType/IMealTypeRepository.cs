using project_server.Models_part;

namespace project_server.Repositories_part
{
    public interface IMealTypeRepository
    {
        Task<IEnumerable<MealTypes>> GetById(int id);
        Task<MealTypes?> CreateAsync(int userId, string name);
    }
}
