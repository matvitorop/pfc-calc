using project_server.Models;
using project_server.Repositories_part;
using System.Diagnostics;

namespace project_server.Services
{
    public class StreakService : IStreakService
    {
        private readonly IUserRepository _userRepository;

        public StreakService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<int?> ChangeCounterAsync(string email, IEnumerable<Days>? recentDays = null)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(email);

                if (user == null)
                    return null;

                int currentStreak = user.VisitsStreak ?? 0;
                

                if (recentDays == null || !recentDays.Any())
                {
                    currentStreak = 1;
                }
                else
                {
                    var orderedDays = recentDays
                        .OrderByDescending(d => d.Day)
                        .Select(d => d.Day.Date)
                        .Distinct()
                        .ToList();

                    if (orderedDays.Count == 1)
                    {
                        currentStreak = 1;
                    }
                    else
                    {
                        var lastDay = orderedDays[0];
                        var prevDay = orderedDays[1];
                        var diff = (lastDay - prevDay).Days;

                        if (diff == 1)
                        {
                            currentStreak += 1;
                        }
                        else if (diff > 1)
                        {
                            currentStreak = 1;
                        }
                    }
                }

                var result = await _userRepository.UpdateUserDetailsAsync(user.Id, "visits_streak", currentStreak);
                return result.VisitsStreak;

            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<int?> CheckForStreakResetAsync(string email, IEnumerable<Days>? recentDays = null)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(email);
                if (user == null)
                {
                    Debug.WriteLine($"User not found when checking streak reset.");
                    return null;
                }

                if (recentDays == null || !recentDays.Any())
                {
                    if (user.VisitsStreak != 0)
                    {
                        var resetUser = await _userRepository.UpdateUserDetailsAsync(user.Id, "visits_streak", 0);
                        //Debug.WriteLine($"[CounterChangerService] No days found, streak reset for {email}");
                        return resetUser.VisitsStreak;
                    }
                    return user.VisitsStreak;
                }

                var orderedDays = recentDays.OrderByDescending(d => d.Day).ToList();
                var lastDay = orderedDays.First().Day.Date;
                var today = DateTime.UtcNow.Date;
                var diff = (today - lastDay).Days;

                if (diff > 1)
                {
                    var resultUser = await _userRepository.UpdateUserDetailsAsync(user.Id, "visits_streak", 0);
                    //Debug.WriteLine($"[CounterChangerService] Streak reset for user {email}. Diff: {diff} days");
                    return resultUser.VisitsStreak;
                }

                return user.VisitsStreak;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[CounterChangerService] Error in CheckForStreakResetAsync: {ex.Message}");
                return null;
            }
        }
    }
}