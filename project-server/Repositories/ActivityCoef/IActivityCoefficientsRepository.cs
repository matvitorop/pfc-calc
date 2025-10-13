using project_server.Models;
using project_server.Models_part;

namespace project_server.Repositories.ActivityCoef
{
    public interface IActivityCoefficientsRepository
    {
        Task<IEnumerable<ActivityCoefficients>> GetAcitivityCoefsAsync();
        Task<float> GeCoefValueByIdAsync(int id);
    }
}
