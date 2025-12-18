import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '../hooks/redux';

interface UpdateMealModalProps {
    id: number;
    label: string;
    initialValue: string | null;
    measurement: number | null;
    onClose: () => void;
    onSave: (value: string) => void;
}

export interface FormUpdateMealData {
    value: string;
    measurement: number;
}

const UpdateMealModal: FC<UpdateMealModalProps> = ({ id, label, initialValue, measurement, onClose, onSave }) => {
    const darkTheme = useAppSelector(state => state.themeReducer.isDarkTheme);
    const isMeasurementEdit = measurement !== null;
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormUpdateMealData>({
        defaultValues: {
            value: initialValue?.toString() || '',
            measurement: measurement || 0,
        },
    });

    const onSubmit = (data: FormUpdateMealData) => {
        if (isMeasurementEdit) {
            onSave(data.measurement.toString());
        } else {
            onSave(data.value);
        }
    };

    useEffect(() => {
        if (!isMeasurementEdit && initialValue) {
            setValue('value', initialValue.toString());
        }
        if (isMeasurementEdit && measurement !== null) {
            setValue('measurement', measurement);
        }
    }, [initialValue, measurement, setValue, isMeasurementEdit]);

    return (
        <div className={`modal-overlay ${darkTheme ? 'dark-theme' : ''}`}>
            <div className={`modal ${darkTheme ? 'dark-theme' : ''}`}>
                <h2>Edit {isMeasurementEdit ? `weight ${label}` : label}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {!isMeasurementEdit ? (
                        <>
                            <input
                                type="text"
                                className={errors.value ? 'modal-input error' : 'modal-input'}
                                placeholder="Meal name"
                                {...register('value', {
                                    required: 'Meal type must contain at least one letter',
                                    minLength: { value: 1, message: 'Meal type must contain at least one letter' },
                                })}
                            />
                            {errors.value && <span className="error-message">{errors.value.message}</span>}
                        </>
                    ) : (
                        <>
                            <input
                                type="number"
                                className={errors.measurement ? 'modal-input error' : 'modal-input'}
                                placeholder="Measurement amount"
                                step="any"
                                {...register('measurement', {
                                    required: 'Measurement is required',
                                    min: { value: 1, message: 'Value cannot be less or equal 0' },
                                    valueAsNumber: true,
                                })}
                            />
                            {errors.measurement && <span className="error-message">{errors.measurement.message}</span>}
                        </>
                    )}

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
