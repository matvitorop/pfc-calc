using project_server.Models;
using project_server.Repositories_part;
using System.Diagnostics;

namespace project_server.Services
{
    public class CounterChangerService : ICounterChangerService
    {
        private readonly IUserRepository _userRepository;

        public CounterChangerService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> ChangeCounterAsync(string email, IEnumerable<Days>? recentDays = null)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(email);
                
                if (user == null)
                {
                    Debug.WriteLine($"User not found when changing counter.");
                    return false;
                }

                int currentStreak = user.VisitsStreak ?? 0;
                DateTime today = DateTime.UtcNow.Date;

                if (recentDays == null || !recentDays.Any())
                {
                    return false;
                }

                var orderedDays = recentDays.OrderByDescending(d => d.Day).ToList();
                var lastDay = orderedDays.First().Day.Date;
                var diff = (today - lastDay).Days;

                if (orderedDays.Count >= 2)
                {
                    var secondDay = orderedDays[1].Day.Date;
                    var diff2 = (lastDay - secondDay).Days;

                    if (diff == 1 && diff2 == 1)
                    {
                        currentStreak += 1;
                    }
                    else
                    {
                        currentStreak = 1;
                    }
                }

                await _userRepository.UpdateUserDetailsAsync(user.Id, "visits_streak", currentStreak);
                return true;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[CounterChangerService] Error: {ex.Message}", ex);
                return false;
            }
        }

        public async Task<bool> CheckForStreakResetAsync(string email, IEnumerable<Days>? recentDays = null)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(email);
                if (user == null)
                {
                    Debug.WriteLine($"User not found when checking streak reset.");
                    return false;
                }

                if (recentDays == null || !recentDays.Any())
                    return false;

                var orderedDays = recentDays.OrderByDescending(d => d.Day).ToList();
                var lastDay = orderedDays.First().Day.Date;
                var today = DateTime.UtcNow.Date;
                var diff = (today - lastDay).Days;

                if (diff > 1)
                {
                    await _userRepository.UpdateUserDetailsAsync(user.Id, "visits_streak", 0);
                    Debug.WriteLine($"[CounterChangerService] Streak reset for user {email}. Diff: {diff} days");
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[CounterChangerService] Error in CheckForStreakResetAsync: {ex.Message}");
                return false;
            }
        }
    }
}