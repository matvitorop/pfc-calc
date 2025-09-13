using System.Diagnostics;
using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;

namespace project_server
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
            if (details.user_id == null)
                return null;

            try
            {
                using var connection = new SqlConnection(_connectionString);
                string sql = @"INSERT INTO Details (user_id, age, weight, height, visits_streak, activity_coef_id, diet_id)
                    OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.age, INSERTED.weight, INSERTED.height,
                    INSERTED.visits_streak, INSERTED.activity_coef_id, INSERTED.diet_id
                    VALUES (@user_id, @age, @weight, @height, @visits_streak, @activity_coef_id, @diet_id);";
                var newDetails  = await connection.QuerySingleOrDefaultAsync<Details>(sql, details);
                return newDetails;
                
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }
        }
        public async Task<Details?> GetItems(int userId)
        {

            try
            {
                using var connection = new SqlConnection(_connectionString);
                string sql = @"SELECT id, user_id, age, weight, height, visits_streak, activity_coef_id, diet_id
                       FROM Details
                       WHERE user_id = @userId;";
                var result = await connection.QuerySingleOrDefaultAsync<Details>(sql, new { userId });
                return result;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }
        }


    



    public async Task<Details?> UpdateDetails(int userId, string fieldName, object value)
    {
        var allowedFields = new HashSet<string>
        {
        "age", "weight", "height", "visits_streak", "activity_coef_id", "diet_id"
        };

        try
        {
            if (!allowedFields.Contains(fieldName.ToLower()))
            {
                Debug.WriteLine($" {fieldName} isn`t allowed to update");
                return null;
            }

            using var connection = new SqlConnection(_connectionString);
            string sql = $"UPDATE Details SET {fieldName} = @value OUTPUT INSERTED.* WHERE user_id = @userId";
            var updatedDetails = connection.QuerySingleOrDefault<Details>(sql, new { value, userId });
            return updatedDetails;
        }
        catch (Exception ex)
        {

            Debug.WriteLine(ex);
            return null;
        }

        

        
            

        
        int rowsAffected = connection.Execute(sql, new { Value = value ?? DBNull.Value, UserId = userId });
        return rowsAffected > 0;





        }


    }
}

/*
 * 
  -----------------   REWRITE ALL WITH DAPPER --------------------------- 
 * 
 * 
 neeed to do + try cath + diets + activity-coef models ... 
 - Details ( change(age, weight, height, visits_streak, coef_id, diet_id, calories_standard))
- Diets(query)  only get all
- Activity_coef(query) only get all 

 

 



 
 */
