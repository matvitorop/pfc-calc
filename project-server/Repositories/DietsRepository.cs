using Dapper;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using project_server.Models;
namespace project_server.Repositories
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
           
            using var connection = new SqlConnection(_connectionString);
            string sql = @"
                SELECT  
                       id              ,
                       name            ,
                       description     ,
                       protein_perc    ,
                       fats_perc       ,
                       carbs_perc       ,
                FROM Diets";
            var result = await connection.QueryAsync<Diets>(sql);
            return result.ToList();
            
        }



    }
}
