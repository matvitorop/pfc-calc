using project_server.Models_part;

namespace project_server.Repositories_part
{
    public interface IMealTypeRepository
    {
        Task<IEnumerable<Meal_Types>> GetById(int id);
    }
}
