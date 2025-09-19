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
        public async Task<DaysModel> AddDayAsync(DaysModel daysModel)
        {
            var sql = @"INSERT INTO Days (user_id, day, meal_type_id, item_id, measurement)
                        OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.day, INSERTED.meal_type_id, INSERTED.item_id, INSERTED.measurement
                    VALUES (@UserId, @DayDate, @MealTypeId, @ItemId, @Measurement)";
            var insertedDay = await _db.QuerySingleAsync<DaysModel>(sql, daysModel);
            return insertedDay;

        }
        public async Task<DaysModel?> GetDayAsync(int userId, DateTime day)
        {
            var sql = "SELECT * FROM Days WHERE user_id = @UserId AND day = @Day";
            var gotDay = await _db.QueryFirstOrDefaultAsync<DaysModel>(sql, new { UserId = userId, Day = day });

            return gotDay ?? new DaysModel
            {
                UserId = userId,
                Day = day
            };
        }
        public async Task<DaysModel> ChangeMeasurementDayAsync(int id, double measurement)
        {
            var sql = @"UPDATE Days SET measurement = @Measurement
                        OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.day, INSERTED.meal_type_id, INSERTED.item_id, INSERTED.measurement
                        WHERE id = @Id";

            var updatedDay = await _db.QueryFirstOrDefaultAsync<DaysModel>(sql, new { Id = id, Measurement = measurement });
            return updatedDay;
        }

        public async Task<DaysModel?> DeleteDayAsync(int id)
        {
            var sql = @"DELETE FROM Days
                        OUTPUT DELETED.id, DELETED.user_id, DELETED.day, DELETED.meal_type_id, DELETED.item_id, DELETED.measurement
                        WHERE id = @Id";

            var deletedDay = await _db.QueryFirstOrDefaultAsync<DaysModel>(sql, new { Id = id });
            return deletedDay;
        }

    }
}
