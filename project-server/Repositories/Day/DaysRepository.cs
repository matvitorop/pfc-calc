using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;
using System.Data;

namespace project_server.Repositories.Day
{
    public class DaysRepository : IDaysRepository
    {
        private readonly string _connectionString;

        public DaysRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }
        public async Task<Days> AddDayAsync(Days daysModel)
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            var sql = @"INSERT INTO Days (user_id, day, meal_type_id, item_id, measurement)
                        OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.day, INSERTED.meal_type_id, INSERTED.item_id, INSERTED.measurement
                    VALUES (@UserId, @Day, @MealTypeId, @ItemId, @Measurement)";
            
            return await db.QuerySingleAsync<Days>(sql, daysModel);
        }
        public async Task<Days?> GetDayAsync(int userId, DateTime day)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = "SELECT * FROM Days WHERE user_id = @UserId AND day = @Day";
            var gotDay = await db.QueryFirstOrDefaultAsync<Days>(sql, new { UserId = userId, Day = day });

            return gotDay ?? new Days
            {
                UserId = userId,
                Day = day
            };
        }
        public async Task<IEnumerable<Days?>> GetDaysAsync(int userId, DateTime? day = null, int? limit = null, int? daysBack = null)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            string sql;
            object parameters;
            if (daysBack.HasValue && daysBack.Value < 0)
            {
                return null;
            }

            if (daysBack.HasValue)
            {
                sql = @"SELECT * FROM Days WHERE user_id = @UserId AND day >= DATEADD(day, -@DaysBack, GETDATE())";

                parameters = new { UserId = userId, DaysBack = daysBack.Value };
            }

            if (day.HasValue)
            {
                sql = "SELECT * FROM Days WHERE user_id = @UserId AND CAST(day AS DATE) = CAST(@Day AS DATE)";
                parameters = new { UserId = userId, Day = day.Value.Date };
            }
            else
            {
                if (limit.HasValue && limit.Value > 0)
                {
                    sql = "SELECT TOP (@Limit) * FROM Days WHERE user_id = @UserId ORDER BY day DESC";
                    parameters = new { UserId = userId, Limit = limit.Value };
                }
                else
                {
                    sql = "SELECT * FROM Days WHERE user_id = @UserId";
                    parameters = new { UserId = userId };
                }
            }

            return await db.QueryAsync<Days>(sql, parameters);
        }

        public async Task<IEnumerable<Days?>> GetUniqueDaysAsync(int userId, int limit)
        {
            using IDbConnection db = new SqlConnection(_connectionString);

            var sql = @"SELECT * FROM (
                SELECT *, 
                       ROW_NUMBER() OVER (PARTITION BY CAST(day AS DATE) ORDER BY day DESC) as rn
                FROM Days
                WHERE user_id = 2
            ) as numbered
            WHERE rn = 1
            ORDER BY day DESC
            OFFSET 0 ROWS FETCH NEXT 2 ROWS ONLY";

            return await db.QueryAsync<Days>(sql, new { UserId = userId, Limit = limit });
            
        }

        public async Task<Days?> ChangeMeasurementDayAsync(int id, double measurement)
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            var sql = @"UPDATE Days SET measurement = @Measurement
                        OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.day, INSERTED.meal_type_id, INSERTED.item_id, INSERTED.measurement
                        WHERE id = @Id";

            return await db.QueryFirstOrDefaultAsync<Days>(sql, new { Id = id, Measurement = measurement });
        }

        public async Task<Days?> DeleteDayAsync(int id)
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            var sql = @"DELETE FROM Days
                        OUTPUT DELETED.id, DELETED.user_id, DELETED.day, DELETED.meal_type_id, DELETED.item_id, DELETED.measurement
                        WHERE id = @Id";

            return await db.QueryFirstOrDefaultAsync<Days>(sql, new { Id = id });
        }

    }
}