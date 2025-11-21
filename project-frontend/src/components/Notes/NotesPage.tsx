import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
    fetchActiveNotesRequest,
    fetchCompletedNotesRequest,
} from '../../store/reducers/notesSlice';
import ActiveNotes from './ActiveNotes';
import CompletedNotes from './CompletedNotes';
import AddNoteForm from './AddNoteForm';

const NotesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    // ✅ Деструктуризуємо state
    const { activeNotes, completedNotes, loading, error } = useAppSelector(
        (state) => state.notesReducer
    );

    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [showCompleted, setShowCompleted] = useState(false);
    
    useEffect(() => {
        console.log('🎨 [Component] Initial state:', { activeNotes, loading, error });
    }, []);

    useEffect(() => {
        console.log('🎨 [Component] State updated:', { activeNotes, loading, error });
    }, [activeNotes, loading, error]);

    useEffect(() => {
        console.log('🚀 [Component] Dispatching fetch...');
        dispatch(fetchActiveNotesRequest());
        dispatch(fetchCompletedNotesRequest());
    }, [dispatch]);
    if (loading) {
        return <div className="loading">Loading notes...</div>;
    }

    return (
        <div className="notes-page">
        <div className="notes-container">
        <h1 className="notes-title">My Notes</h1>

    {/* Форма додавання */}
    <AddNoteForm />

    {/* Повідомлення про помилку */}
    {error && (
        <div className="error-message">
            <span>❌ {error}</span>
    </div>
    )}

    {/* Активні нотатки */}
    <ActiveNotes />

    {/* Кнопка показати/сховати завершені */}
    <button
    className="toggle-completed-btn"
    onClick={() => setShowCompleted(!showCompleted)}
>
    {showCompleted ? '🔼 Hide Completed' : '🔽 Show Completed'}
    </button>

    {/* Завершені нотатки */}
    {showCompleted && <CompletedNotes />}
    </div>
    </div>
);
};

export default NotesPage;