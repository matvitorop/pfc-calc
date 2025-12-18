import React, { useEffect, useState } from 'react';
import { ChevronLeft, ListTodo } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
    fetchActiveNotesRequest,
    fetchCompletedNotesRequest,
    addNoteRequest,
    completeNoteRequestStarted,
    restoreNoteRequest,
    deleteNoteRequest,
} from '../../store/reducers/notesSlice';
import ActiveNotes from './ActiveNotes';
import CompletedNotes from './CompletedNotes';
import AddNoteForm from './AddNoteForm';
import NotifNote from "./NotifNote";
import './Notes.css'
import { useNavigate } from 'react-router-dom';

const NotesPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    //state
    const { activeNotes, completedNotes, loading, error } = useAppSelector(
        (state) => state.notesReducer
    );
    const isDarkTheme = useAppSelector(state => state.themeReducer.isDarkTheme);

    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [showCompleted, setShowCompleted] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [notif, setNotif] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "error"
    });

    const showNotif = (message: string, type: "success" | "error") => {
        setNotif({ show: true, message, type });
    };
    
    useEffect(() => {
        console.log(' [Component] Initial state:', { activeNotes, loading, error });
    }, []);

    useEffect(() => {
        console.log(' [Component] State updated:', { activeNotes, loading, error });
    }, [activeNotes, loading, error]);

    useEffect(() => {
        console.log('[Component] Dispatching fetch...');
        dispatch(fetchActiveNotesRequest());
        dispatch(fetchCompletedNotesRequest());
    }, [dispatch]);
    if (loading) {
        return <div className="loading">Loading notes...</div>;
    }

    return (
        <div className={`notes-page ${isDarkTheme ? 'dark-theme' : ''}`}>
            <div className="notes-container">
                <div className="notes-header">
                    <button
                        className="notes-back-btn"
                        aria-label="Go back"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="notes-header-title">
                        <ListTodo size={24} />
                        Tasks
                    </h1>
                </div>

                <div className="notes-add-section">
                    <AddNoteForm showNotif={showNotif} />
                </div>

                <div className="notes-tabs">
                    <button
                        className={`notes-tab ${activeTab === 'active' ? 'notes-tab-active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Active ({activeNotes.length})
                    </button>
                    <button
                        className={`notes-tab ${activeTab === 'completed' ? 'notes-tab-active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed ({completedNotes.length})
                    </button>
                </div>

                <div className="notes-content">
                    {activeTab === 'active' ? (
                        <ActiveNotes
                            showNotif={showNotif}
                        />
                    ) : (
                        <CompletedNotes
                            showNotif={showNotif}
                        />
                    )}
                </div>
                
                {notif.show && (
                    <NotifNote
                        message={notif.message}
                        type={notif.type}
                        onClose={() => setNotif({ ...notif, show: false })}
                    />
                )}
            </div>
        </div>
    );
};
export default NotesPage;