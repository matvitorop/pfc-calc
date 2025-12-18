import React, { type FC } from 'react';
import { useForm } from 'react-hook-form';
import type { FormData } from './UpdateUserModal';
import { useFetchMealTypes } from '../hooks/fetchMealTypes';
import { useAppSelector } from '../hooks/redux';
interface AddMealTypeProps {
    initialValue: string;
    onClose: () => void;
    onSave: (value: string) => void;
}

const AddMealTypeForm: FC<AddMealTypeProps> = ({ initialValue, onClose, onSave }) => {
    const meals = useAppSelector(state => state.mealReducer.data);

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

    const checkMealNameExists = (value: string): boolean | string => {
        const trimmedValue = value.trim().toLowerCase();
        const exists = meals?.some(meal => meal.name.trim().toLowerCase() === trimmedValue);

        return exists ? 'Meal type with this name already exists' : true;
    };

    return (
        <form className="add-meal-form" onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                placeholder="Meal type name..."
                {...register('value', {
                    required: 'Mealtype must contains at least one letter',
                    minLength: { value: 1, message: 'Meal type must contain at least one letter' },
                    validate: checkMealNameExists,
                })}
                autoFocus
                className={errors.value ? 'modal-input error' : 'modal-input'}
            />
            {errors.value && <span className="error-message">{errors.value.message}</span>}
            <button type="submit" className="confirm-btn">
                Додати
            </button>
            <button
                type="button"
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
