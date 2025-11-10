using System.Reflection.Metadata;
using project_server.Models_part;
using project_server.Repositories_part;
using project_server.Schemas;
using project_server.Services;

namespace project_server.Services_part
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;
        private readonly IAuthService _authService;
        private readonly ICalorieStandardService _caloriesStandartService;

        private static string SnakeToPascalCase(string str)
        {
            if (string.IsNullOrEmpty(str)) return str;

            return string.Join("", str
                .Split('_', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => char.ToUpperInvariant(s[0]) + s.Substring(1)));
        }

        public UserService(IUserRepository userRepo, IAuthService authService, ICalorieStandardService calorieStandart)
        {
            _userRepo = userRepo;
            _authService = authService;
            _caloriesStandartService = calorieStandart;
        }

        public async Task<Users?> RegisterAsync(string email, string password, string username, DateTime age, float weight, float height, int visitsStreak, int activityCoefId, int dietId, int caloriesStandard)
        {
            try
            {
                var salt = _authService.GenerateSalt();
                var hash = _authService.HashPassword(password, salt);

                if (weight <= 0 || height <= 0 || activityCoefId <= 0 || dietId <= 0)
                    throw new ArgumentException("params must be greater than zero.");
                if (age > DateTime.Now)
                    throw new ArgumentException("Birth date cannot be in the future.");

                caloriesStandard = await _caloriesStandartService.CalculateCalorieStandard(age, weight, height, activityCoefId, dietId);
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

        public async Task<Users?> UpdateUserDetailsAsync(int id, string fieldName, string value)
        {
            try
            {
                string fieldNamePascalCase = SnakeToPascalCase(fieldName);

                var property = typeof(Users).GetProperty(fieldNamePascalCase);
                if (property == null)
                    throw new ArgumentException($"Field '{fieldNamePascalCase}' not found in Users model");

                var targetType = property.PropertyType;

                object? convertedValue;
                try
                { 
                    var underlyingType = Nullable.GetUnderlyingType(targetType) ?? targetType;
                    convertedValue = Convert.ChangeType(value, underlyingType);
                }
                catch
                {
                    return null;
                }

                var updatedUser = await _userRepo.UpdateUserDetailsAsync(id, fieldName, convertedValue);
                if (updatedUser == null) return null;


                var fieldsThatAffectCalories = new HashSet<string>
                {
                    nameof(Users.Age),
                    nameof(Users.Weight),
                    nameof(Users.Height),
                    nameof(Users.ActivityCoefId),
                    nameof(Users.DietId)                
                };

                bool isCustomDiet =      
                    string.Equals(fieldName, nameof(Users.DietId), StringComparison.OrdinalIgnoreCase) &&
                    convertedValue is int dietId &&
                    dietId == (int)DietСonstants.CustomCalorieDietId;

                if (isCustomDiet)
                    return updatedUser;

                if (fieldsThatAffectCalories.Contains(fieldName))
                {

                    updatedUser = await _caloriesStandartService.RecalculateCaloriesStandard(updatedUser);
                }

                return updatedUser;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error during UpdateUserDetailsAsync: {ex.Message}");
                throw;
            }
        }



        // UNUSED METHOD
        //public async Task<DetailsResponse> GetUserDetailsAsync(string userEmail)
        //{
        //    var user = await _userRepo.GetByEmailAsync(userEmail);
        //
        //    if (user == null)
        //    {
        //        return new DetailsResponse
        //        {
        //            Success = false,
        //            Message = "User not found",
        //            Data = null
        //        };
        //    }
        //
        //    return new DetailsResponse
        //    {
        //        Success = true,
        //        Message = "User details retrieved successfully",
        //        Data = user  
        //    };
        //}
    }
}

public enum DietСonstants
{
    CustomCalorieDietId = 4
}
