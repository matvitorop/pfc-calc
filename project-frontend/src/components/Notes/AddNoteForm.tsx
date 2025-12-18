import React, { useState } from 'react';
import { Plus, Calendar, X } from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { addNoteRequest } from '../../store/reducers/notesSlice';

interface AddNoteFormProps {
    showNotif: (message: string, type: 'success' | 'error') => void;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ showNotif }) => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        const dueDateISO = dueDate ? new Date(dueDate).toISOString() : undefined;

        dispatch(
            addNoteRequest({
                title: title.trim(),
                dueDate: dueDateISO
            })
        );

        showNotif('Task added successfully!', 'success');

        setTitle('');
        setDueDate('');
        setShowDatePicker(false);
    };

    const clearDate = () => {
        setDueDate('');
        setShowDatePicker(false);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <form onSubmit={handleSubmit} className="note-add-form">
            <div className="note-add-wrapper">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="note-add-input"
                    autoFocus
                />

                <div className="note-add-actions">
                    {!showDatePicker ? (
                        <button
                            type="button"
                            className="note-add-btn-icon"
                            onClick={() => setShowDatePicker(true)}
                        >
                            <Calendar size={20} />
                        </button>
                    ) : (
                        <div className="note-add-date-wrapper">
                            <input
                                type="date"
                                className="note-add-date-input"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                min={today}
                            />
                            <button
                                type="button"
                                className="note-add-btn-clear"
                                onClick={clearDate}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="note-add-btn-submit"
                        disabled={!title.trim()}
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddNoteForm;
