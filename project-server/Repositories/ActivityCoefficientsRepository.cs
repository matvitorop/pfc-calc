using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;
using System.Collections;

namespace project_server.Repositories
{
    public class ActivityCoefficientsRepository
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
    }
}