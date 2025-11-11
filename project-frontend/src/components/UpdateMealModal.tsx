import { type FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { FormData } from './UpdateUserModal';
interface UpdateMealModalProps {
    id: number;
    label: string;
    initialValue: string;
    onClose: () => void;
    onSave: (value: string) => void;
}

const UpdateMealModal: FC<UpdateMealModalProps> = ({ id, label, initialValue, onClose, onSave }) => {
    // const [value, setValue] = useState(initialValue.toString());
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            value: initialValue.toString(),
        },
    });

    const onSubmit = (data: FormData) => {
        onSave(data.value);
    };

    useEffect(() => {
        setValue('value', initialValue.toString());
    }, [initialValue, setValue]);
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit {label}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        className={errors.value ? 'modal-input error' : 'modal-input'}
                        {...register('value', {
                            required: 'Mealtype must contains at least one letter',
                            minLength: { value: 1, message: 'Meal type must contain at least one letter' },
                        })}
                    />
                    {errors.value && <span className="error-message">{errors.value.message}</span>}
                    <div className="modal-actions">
                        <button
                            onClick={e => {
                                e.preventDefault();
                                onClose();
                            }}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button className="btn-save">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateMealModal;
