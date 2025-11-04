import { type FC, useState } from 'react';
interface UpdateUserModalProps {
    fieldName: string;
    label: string;
    initialValue: string | number | Date;
    onClose: () => void;
    onSave: (value: string) => void;
}

const UpdateUserModal: FC<UpdateUserModalProps> = ({ fieldName, label, initialValue, onClose, onSave }) => {
    const [value, setValue] = useState(initialValue.toString());

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit {label}</h2>
                <input type="text" value={value} onChange={e => setValue(e.target.value)} className="modal-input" />
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={() => onSave(value)} className="btn-save">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateUserModal;
