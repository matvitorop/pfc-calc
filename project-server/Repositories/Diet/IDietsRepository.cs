using project_server.Models;
using project_server.Models_part;

namespace project_server.Repositories.Diet
{
    public interface IDietsRepository
    {
        Task<IEnumerable<Diets>> GetDietsAsync();
    }
}
