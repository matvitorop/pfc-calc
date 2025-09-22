using Microsoft.Data.SqlClient;
using project_server.Models_part;
using System.Data;
using Dapper;

namespace project_server.Repositories_part
{
    public class NotesRepository : INotesRepository
    {
        private readonly string _coonnectionString;

        public NotesRepository(IConfiguration config)
        {
            _coonnectionString = config.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }
        public async Task<Notes> AddNoteAsync(int userId, string title, DateTime? dueDate)
        {
            using IDbConnection db = new SqlConnection(_coonnectionString);

            var sql = @"INSERT INTO Notes (user_id, title, due_date, is_completed, completed_date)
                    OUTPUT INSERTED.*
                    VALUES (@User_id, @Title, @Due_date, 0, NULL);";

            return await db.QuerySingleAsync<Notes>(sql,
                new
                {
                    User_id = userId,
                    Title = title,
                    Due_date = dueDate
                });
        }

        public async Task<Notes?> CompleteNoteAsync(int noteId)
        {
            using IDbConnection db = new SqlConnection(_coonnectionString);
            var sql = @"UPDATE Notes
                    SET is_completed = 1,
                    completed_date = GETDATE()
                    OUTPUT INSERTED.*
                    WHERE id = @Id and is_completed = 0;";

            return await db.QueryFirstOrDefaultAsync<Notes>(sql,
                new { Id = noteId });
        }

        public async Task<Notes?> DeleteNoteAsync(int noteId)
        {
            using IDbConnection db = new SqlConnection(_coonnectionString);
            var sql = @"DELETE FROM Notes
                    OUTPUT DELETED.*
                    WHERE Id = @NoteId";

            return await db.QueryFirstOrDefaultAsync<Notes>(sql, new { NoteId = noteId });

        }

        public async Task<IEnumerable<Notes>> GetActiveNotesAsync(int userId)
        {
            using IDbConnection db = new SqlConnection(_coonnectionString);
            var sql = @"
                    SELECT * FROM NOTES
                    WHERE user_id = @UserId AND is_completed = 0
                    ORDER BY due_date ASC;";

            return await db.QueryAsync<Notes>(sql, new { UserId = userId });
        }

        public async Task<IEnumerable<Notes>> GetCompletedNotesAsync(int userId)
        {
            using IDbConnection db = new SqlConnection(_coonnectionString);
            var sql = @"
                    SELECT * FROM NOTES
                    WHERE user_id = @UserId AND is_completed = 1
                    ORDER BY completed_date DESC;";

            return await db.QueryAsync<Notes>(sql, new { UserId = userId });
        }
    }
}