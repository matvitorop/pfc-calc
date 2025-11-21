import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
    completeNoteRequestStarted,
    deleteNoteRequest,
} from '../../store/reducers/notesSlice';

const ActiveNotes: React.FC = () => {
    const dispatch = useAppDispatch();
    const { activeNotes } = useAppSelector((state) => state.notesReducer);

    const handleComplete = (noteId: number) => {
        dispatch(completeNoteRequestStarted(noteId));
        //require fetch
    };

    const handleDelete = (noteId: number) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            dispatch(deleteNoteRequest(noteId));
        }
    };

    // Форматування дати
    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    // Перевірка чи прострочена нотатка
    const isOverdue = (dateString: string | null) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    if (activeNotes.length === 0) {
        return (
            <div className="empty-state">
                <p>📝 No active notes. Create one above!</p>
            </div>
        );
    }

    return (
        <div className="active-notes-section">
            <h2 className="section-title">
                Active Notes <span className="count">({activeNotes.length})</span>
            </h2>

            <div className="notes-list">
                {activeNotes.map((note) => (
                    <div
                        key={note.id}
                        className={`note-item ${isOverdue(note.dueDate) ? 'overdue' : ''}`}
                    >
                        {/* Checkbox для завершення */}
                        <button
                            className="complete-btn"
                            onClick={() => handleComplete(note.id)}
                            title="Mark as complete"
                        >
                            <div className="checkbox">
                                <span className="checkmark"></span>
                            </div>
                        </button>

                        {/* Контент нотатки */}
                        <div className="note-content">
                            <span className="note-title">{note.title}</span>

                            {note.dueDate && (
                                <span
                                    className={`due-date ${
                                        isOverdue(note.dueDate) ? 'overdue' : ''
                                    }`}
                                >
                                    📅 {formatDate(note.dueDate)}
                                </span>
                            )}
                        </div>

                        {/* Кнопка видалення */}
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

export default ActiveNotes;