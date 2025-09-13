using project_server.Models;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
namespace project_server
{
    public class DietsRepository
    {
        private readonly string _connectionString;
        public DietsRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }


        public async Task<List<Diets>> GetItems()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                string sql = @"SELECT * FROM Diets";
                var result = await connection.QueryAsync<Diets>(sql);
                return result.ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<Diets>();
            }
        }



    }
}
