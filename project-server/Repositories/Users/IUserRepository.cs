using project_server.Models_part;

namespace project_server.Repositories_part
{
    public interface IUserRepository
    {
        Task<Users?> CreateAsync(string email, string password, string username, string salt);
        Task<Users?> DeleteAsync(int id);
        Task<Users?> GetByEmailAsync(string email);
        Task<Users?> UpdateEmailAsync(int id, string email);
        Task<Users?> UpdatePasswordAsync(int id, string password, string salt);
        Task<Users?> UpdateUsernameAsync(int id, string username);
    }
}
