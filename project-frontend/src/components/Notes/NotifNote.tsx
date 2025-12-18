import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotifNoteProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
}

const NotifNote: React.FC<NotifNoteProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`note-notif note-notif-${type}`}>
            <div className="note-notif-icon">
                {type === 'success' ? (
                    <CheckCircle size={20} />
                ) : (
                    <XCircle size={20} />
                )}
            </div>
            <p className="note-notif-message">{message}</p>
            <button onClick={onClose} className="note-notif-close">
                <X size={16} />
            </button>
        </div>
    );
};

export default NotifNote;