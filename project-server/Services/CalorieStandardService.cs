using System.Threading.Tasks;
using project_server.Models_part;
using project_server.Repositories.ActivityCoef;
using project_server.Repositories.Diet;
using project_server.Repositories_part;

namespace project_server.Services
{
    public class CalorieStandardService : ICalorieStandardService
    {   
        private readonly IUserRepository _userRepo;
         private readonly IActivityCoefficientsRepository _coefsRepo;
        private readonly IDietsRepository _dietsRepo;
        public  CalorieStandardService(IActivityCoefficientsRepository coefsRepo,IDietsRepository dietsRepo, IUserRepository userRepo) {
            _coefsRepo = coefsRepo;
            _dietsRepo = dietsRepo;
            _userRepo = userRepo;

        }

        public async Task<int> CalculateCalorieStandard(DateTime birthDate, float weight, float height, int coefId, int dietId)
        {
            var age = DateTime.Now.Year - birthDate.Year;
            if (birthDate.Date > DateTime.Now.AddYears(-age)) age--;

            float bmr = 10 * weight + 6.25f * height - 5 * age - 78; 
            float coefValue = await _coefsRepo.GeCoefValueByIdAsync(coefId);


            int dietAdjustment = dietId switch
            {
                1 => 0,     
                2 => -300,   
                3 => 250,    
                _ => 0
            };

            return (int)(bmr * coefValue * dietAdjustment);
        }

        public async Task<Users?> RecalculateCaloriesStandard(Users user) {

            var newCalories = await CalculateCalorieStandard(
                        user.Age,
                        user.Weight,
                        user.Height,
                        user.ActivityCoefId,
                        user.DietId
                    );


           var updatedUser = await _userRepo.UpdateUserDetailsAsync(user.Id, "calories_standard", newCalories);
            return updatedUser;
        }
    }
}

