using Dapper;
using Microsoft.Data.SqlClient;
using project_server.Models;
namespace project_server.Repositories.Diet
{
    public class DietsRepository : IDietsRepository
    {
        private readonly string _connectionString;
        public DietsRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<IEnumerable<Diets>> GetDietsAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            string sql = @"
                SELECT *
                FROM Diets";

            return await connection.QueryAsync<Diets>(sql);
        }

    }
}


