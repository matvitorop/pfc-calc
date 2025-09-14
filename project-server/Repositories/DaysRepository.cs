using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using Dapper;
using project_server.Models;
using project_server.Interfaces;

namespace project_server.Repositories
{
    public class DaysRepository : IDaysRepository
    {
        private readonly IDbConnection _db;

        public DaysRepository(IDbConnection db)
        {
            _db = db;
        }
        public async Task AddDay(DaysModel daysModel)
        {
            var sql = @"INSERT INTO Days (user_id, day, meal_type_id, item_id, measurement)
                    VALUES (@UserId, @DayDate, @MealTypeId, @ItemId, @Measurement)";
            await _db.ExecuteAsync(sql, daysModel);
        }
        public async Task<DaysModel?> GetDay(int userId, DateTime day)
        {
            var sql = "SELECT * FROM Days WHERE user_id = @UserId AND day = @Day";
            return await _db.QueryFirstOrDefaultAsync<DaysModel>(sql, new { UserId = userId, Day = day });
        }
        public async Task ChangeMeasurementDay(int id, double measurement)
        {
            var sql = "UPDATE Days SET measurement = @Measurement WHERE id = @Id";
            await _db.ExecuteAsync(sql, new { Id = id, Measurement = measurement });
        }

        public async Task DeleteDay(int id)
        {
            var sql = "DELETE FROM Days WHERE id = @Id";
            await _db.ExecuteAsync(sql, new { Id = id });
        }
    }
}
