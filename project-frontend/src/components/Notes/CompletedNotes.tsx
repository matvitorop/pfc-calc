import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
    restoreNoteRequest,
    deleteNoteRequest,
} from '../../store/reducers/notesSlice';
interface CompletedNotesProps {
    showNotif: (message: string, type: "success" | "error") => void;
}

const CompletedNotes: React.FC<CompletedNotesProps> = ({showNotif}) => {
    const dispatch = useAppDispatch();
    const { completedNotes } = useAppSelector((state) => state.notesReducer);

    const handleRestore = (noteId: number) => {
        dispatch(restoreNoteRequest(noteId));
        showNotif('Task restored!', 'success');
    };

    const handleDelete = (noteId: number) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            dispatch(deleteNoteRequest(noteId));
            showNotif('Task deleted', 'success');
        }
    };

    // formatting completed date
    const formatCompletedDate = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();

        if (date.toDateString() === today.toDateString()) {
            return '  Completed today';
        }

        return `  Completed on ${date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })}`;
    };

    if (completedNotes.length === 0) {
        return (
            <div className="completed-notes-section">
                <h2 className="section-title">
                    Completed Notes <span className="count">(0)</span>
                </h2>
                <div className="empty-state">
                    <p>🎉 No completed notes yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="completed-notes-section">
            <h2 className="section-title">
                Completed Notes <span className="count">({completedNotes.length})</span>
            </h2>

            <div className="notes-list">
                {completedNotes.map((note) => (
                    <div key={note.id} className="note-item completed">
                        <button
                            className="complete-btn"
                            onClick={() => handleRestore(note.id)}
                            title="Restore note"
                        >
                            <div className="checkbox checked">
                                <span className="checkmark">✓</span>
                            </div>
                        </button>
                        
                        <div className="note-content">
                            <span className="note-title completed-text">
                                {note.title}
                            </span>

                            {note.completedDate && (
                                <span className="completed-date">
                                    {formatCompletedDate(note.completedDate)}
                                </span>
                            )}
                        </div>

                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(note.id)}
                            title="Delete note"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompletedNotes;