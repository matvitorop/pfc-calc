import React, { type FC } from 'react';
import { useForm } from 'react-hook-form';
import type { FormData } from './UpdateUserModal';
interface AddMealTypeProps {
    initialValue: string;
    onClose: () => void;
    onSave: (value: string) => void;
}

const AddMealTypeForm: FC<AddMealTypeProps> = ({ initialValue, onClose, onSave }) => {
    const {
        register,
        handleSubmit,

        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            value: initialValue.toString(),
        },
    });
    const onSubmit = (data: FormData) => {
        onSave(data.value);
    };

    return (
        <form className="add-meal-form" onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                placeholder="Meal type name..."
                {...register('value', {
                    required: 'Mealtype must contains at least one letter',
                    minLength: { value: 1, message: 'Meal type must contain at least one letter' },
                })}
                autoFocus
                className={errors.value ? 'modal-input error' : 'modal-input'}
            />
            {errors.value && <span className="error-message">{errors.value.message}</span>}
            <button className="confirm-btn">Додати</button>
            <button
                onClick={e => {
                    e.preventDefault();
                    onClose();
                }}
                className="cancel-add-btn"
            >
                Скасувати
            </button>
        </form>
    );
};

export default AddMealTypeForm;
