using project_server.Models_part;

namespace project_server.Repositories_part
{
    public interface INotesRepository
    {
        Task<Notes> AddNoteAsync(int userId, string title, DateTime dueDate);
        Task<Notes?> DeleteNoteAsync(int noteId);
        Task<Notes?> UpdateNoteAsync(int noteId);
        Task<IEnumerable<Notes>> GetCompletedNotesAsync(int userId);
        Task<IEnumerable<Notes>> GetActiveNotesAsync(int userId);
    }
}
