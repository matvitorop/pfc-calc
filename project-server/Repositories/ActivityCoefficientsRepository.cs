using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;

namespace project_server.Repositories
{
    public class ActivityCoefficientsRepository
    {
        private readonly string _connectionString;
        public ActivityCoefficientsRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }


        public async Task<List<ActivityCoefficients>> GetItems()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                string sql = @"SELECT id, name, value FROM ActivityCoefficients";
                var result = await connection.QueryAsync<ActivityCoefficients>(sql);
                return result.ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<ActivityCoefficients>();
            }
        }
    }
}
