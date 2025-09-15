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

        public async Task<Users?> RegisterAsync(string email, string password, string username)
        {
            try
            {
                var salt = _authService.GenerateSalt();
                var hash = _authService.HashPassword(password, salt);

                var user = await _userRepo.CreateAsync(email, hash, username, salt);

                if (user == null)
                {
                    return null;
                }

                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error during RegisterAsync: {ex.Message}");
                return null;
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
                return null;
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
                return null;
            }
        }
    }
}
