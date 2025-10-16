using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;
using project_server.Models_part;
using System.Collections;
using System.Data;

namespace project_server.Repositories.ActivityCoef
{
    public class ActivityCoefficientsRepository : IActivityCoefficientsRepository
    {
        private readonly string _connectionString;
        public ActivityCoefficientsRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<IEnumerable<ActivityCoefficients>> GetAcitivityCoefsAsync()
        {   
            using var connection = new SqlConnection(_connectionString);
            string sql = @"SELECT id, name, value FROM ActivityCoefficients";

            return await connection.QueryAsync<ActivityCoefficients>(sql);
        }

        public async Task<float> GeCoefValueByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            string sql = @"SELECT value FROM ActivityCoefficients  WHERE id = @Id";

            return await connection.QuerySingleAsync<float>(sql, new { Id = id });
        }


        
    }
}