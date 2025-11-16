import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { addNoteRequest } from '../../store/reducers/notesSlice';

const AddNoteForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (title.trim()) {
            dispatch(
                addNoteRequest({
                    title: title.trim(),
                    dueDate: dueDate || undefined,
                })
            );

            // Очистити форму
            setTitle('');
            setDueDate('');
            setShowDatePicker(false);
        }
    };

    return (
        <form className="add-note-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <input
                    type="text"
                    className="note-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new note..."
                    maxLength={100}
                />

                <button
                    type="button"
                    className="date-toggle-btn"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    title="Add due date"
                >
                    📅
                </button>

                <button type="submit" className="add-btn" disabled={!title.trim()}>
                    ➕ Add
                </button>
            </div>

            {showDatePicker && (
                <div className="date-picker">
                    <input
                        type="date"
                        className="date-input"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]} // Мінімум сьогодні
                    />
                    {dueDate && (
                        <button
                            type="button"
                            className="clear-date-btn"
                            onClick={() => setDueDate('')}
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}
        </form>
    );
};

export default AddNoteForm;