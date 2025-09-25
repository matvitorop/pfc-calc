using project_server.Models_part;
using project_server.Repositories_part;

namespace project_server.Services_part
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;
        private readonly IAuthService _authService;

        public UserService(IUserRepository userRepo, IAuthService authService)
        {
            _userRepo = userRepo;
            _authService = authService;
        }

        public async Task<Users?> RegisterAsync(string email, string password, string username, DateTime age, float weight, float height, int visitsStreak, int activityCoefId, int dietId, int caloriesStandard)
        {
            try
            {
                var salt = _authService.GenerateSalt();
                var hash = _authService.HashPassword(password, salt);

                return await _userRepo.CreateAsync(email, hash, username, salt,age,weight, height, visitsStreak, activityCoefId, dietId, caloriesStandard);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error during RegisterAsync: {ex.Message}");
                throw;
                //throw new Exception("Error during user registration", ex);
            }
        }

        public async Task<Users?> AuthenticateAsync(string email, string password)
        {
            try
            {
                var user = await _userRepo.GetByEmailAsync(email);
                if (user == null) return null;

                return _authService.VerifyPassword(password, user.Salt, user.HashPass) ? user : null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error during AuthenticateAsync: {ex.Message}");
                throw;
                //throw new Exception("Error during user authentication", ex);
            }
        }

        public async Task<Users?> UpdatePasswordAsync(int id, string newPassword)
        {
            try
            {
                var salt = _authService.GenerateSalt();
                var hash = _authService.HashPassword(newPassword, salt);

                return await _userRepo.UpdatePasswordAsync(id, hash, salt);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error during UpdatePasswordAsync: {ex.Message}");
                throw;
                //throw new Exception("Error during password update", ex);
            }
        }

        public async Task<Users?> UpdateUserDetailsAsync(int id, string fieldName, object value)
        {
            try
            {
                return await _userRepo.UpdateUserDetailsAsync(id, fieldName, value);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error during UpdateUserDetailsAsync: {ex.Message}");
                throw;
            }
        }
    }
}
