using System.Diagnostics;
using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;

namespace project_server.Repositories
{
    public class DetailsRepository
    {
        private readonly string _connectionString;
        public DetailsRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        public async Task<Details?> AddItems(Details details)
        {
            using var connection = new SqlConnection(_connectionString);
            string sql = @"
                INSERT INTO Details (user_id, age, weight, height, visits_streak, activity_coef_id, diet_id)
                OUTPUT INSERTED.id AS Id, 
                        INSERTED.user_id AS UserId, 
                        INSERTED.age AS Age, 
                        INSERTED.weight AS Weight, 
                        INSERTED.height AS Height,
                        INSERTED.visits_streak AS VisitsStreak, 
                        INSERTED.activity_coef_id AS ActivityCoefId, 
                        INSERTED.diet_id AS DietId
            VALUES (@UserId, @Age, @Weight, @Height, @VisitsStreak, @ActivityCoefId, @DietId);";
            var newDetails  = await connection.QuerySingleOrDefaultAsync<Details>(sql, details);
            return newDetails;
                
            
        }
        public async Task<Details?> GetItems(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            string sql = @"
                SELECT id              AS Id,
                       user_id         AS UserId,
                       age             AS Age,
                       weight          AS Weight,
                       height          AS Height,
                       visits_streak   AS VisitsStreak,
                       activity_coef_id AS ActivityCoefId,
                       diet_id          AS DietId
                FROM Details
                WHERE user_id = @UserId;";
            var result = await connection.QuerySingleOrDefaultAsync<Details>(sql, new { UserId = userId });
            return result;
           
        }


        public async Task<Details?> UpdateDetails(int userId, string fieldName, object value)
        {
            var allowedFields = new HashSet<string>{
                "age", "weight", "height", "visits_streak", "activity_coef_id", "diet_id"
            };

            
            if (!allowedFields.Contains(fieldName.ToLower()))
            {
                Debug.WriteLine($" {fieldName} isn`t allowed to update");
                return null;
            }

            using var connection = new SqlConnection(_connectionString);
            string sql = $@"
                UPDATE Details 
                SET {fieldName} = @value 
                OUTPUT 
                    INSERTED.id               AS Id,
                    INSERTED.user_id          AS UserId,
                    INSERTED.age              AS Age,
                    INSERTED.weight           AS Weight,
                    INSERTED.height           AS Height,
                    INSERTED.visits_streak    AS VisitsStreak,
                    INSERTED.activity_coef_id AS ActivityCoefId,
                    INSERTED.diet_id          AS DietId
                WHERE user_id = @UserId";
            var updatedDetails = await connection.QuerySingleOrDefaultAsync<Details>(sql, new { value, UserId = userId });
            return updatedDetails;

        }
       
        

    }
}

