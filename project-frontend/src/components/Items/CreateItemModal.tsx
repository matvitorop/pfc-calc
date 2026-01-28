import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import '../../../css/searchItem.css';
import { graphqlFetch } from '../../GraphQL/fetchRequest';

const createCustomItemMutation = `
mutation AddCustomItem ($item:customItem!, $calories: Float){
  addCustomItem(customItem:$item, calories:$calories){
    success
    message
    item {
      id
      name
      proteins
      fats
      carbs
      calories
    }
  }
}
`;

interface createItemProps {
    initialValue: string;
    onClose: () => void;
}
interface createItemFormData {
    name: string;
    description: string;
    proteins: string;
    fats: string;
    carbs: string;
    calories: string;
}

const CreateItemModal = ({ initialValue, onClose }: createItemProps) => {
    /* const [name, setName] = useState('');
    const [proteins, setProteins] = useState<string>('');
    const [fats, setFats] = useState<string>('');
    const [carbs, setCarbs] = useState<string>('');
    const [calories, setCalories] = useState<string>('');
    const [description, setDescription] = useState(''); */

    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<createItemFormData>({
        defaultValues: {
            name: initialValue || '',
            description: '',
            proteins: '',
            fats: '',
            carbs: '',
            calories: '',
        },
        mode: 'onChange',
    });
    const watchedValues = useWatch({
        control,
        name: ['proteins', 'fats', 'carbs'],
    });
    const [proteins, fats, carbs] = watchedValues;
    useEffect(() => {
        const p = Number(proteins);
        const f = Number(fats);
        const c = Number(carbs);

        if (!isNaN(p) && !isNaN(f) && !isNaN(c)) {
            const calculated = Math.round(p * 4 + f * 9 + c * 4);
            setValue('calories', calculated === 0 ? '' : String(calculated), { shouldValidate: true });
        }
    }, [proteins, fats, carbs]);

    const onSubmit = async (data: createItemFormData) => {
        setLoading(true);

        const res = await graphqlFetch<{
            addCustomItem: { success: boolean; message: string };
        }>(
            createCustomItemMutation,
            {
                item: {
                    name: data.name,

                    proteins: Number(data.proteins),
                    fats: Number(data.fats),
                    carbs: Number(data.carbs),
                    description: data.description,
                },
                calories: data.calories === '' ? null : Number(data.calories),
            },
            true,
        );

        setLoading(false);

        if (res.errors?.length) {
            setIsSuccess(false);
            setMessage(res.errors[0].message);
            return;
        }

        const response = res.data?.addCustomItem;

        if (response?.success) {
            setIsSuccess(true);
            setMessage(response.message);
            setTimeout(() => onClose(), 1000);
        } else {
            setIsSuccess(false);
            setMessage(response?.message ?? 'Error occurred');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card create-item-modal">
                <h2 className="modal-title">Create Custom Item</h2>
                <div className="ci-field-name">
                    <input
                        className="ci-input"
                        placeholder="Name"
                        {...register('name', {
                            required: 'Food name is required',
                            minLength: { value: 1, message: 'At least one letter' },
                        })}
                    />
                    <div className="ci-error-container">{errors.name && <span className="error-message">{errors.name.message}</span>}</div>
                </div>

                <textarea className="ci-input" placeholder="Description (optional)" {...register('description')} />
                <div className="ci-fields-row">
                    <div className="ci-field">
                        <label>Proteins (g)</label>
                        <input
                            {...register('proteins', {
                                required: 'Required',
                                pattern: { value: /^\d*\.?\d*$/, message: 'Numbers only' },
                            })}
                        />
                        {errors.proteins && <span className="error-message">{errors.proteins.message}</span>}
                    </div>

                    <div className="ci-field">
                        <label>Fats (g)</label>
                        <input
                            {...register('fats', {
                                required: 'Required',
                                pattern: { value: /^\d*\.?\d*$/, message: 'Numbers only' },
                            })}
                        />
                        {errors.fats && <span className="error-message">{errors.fats.message}</span>}
                    </div>

                    <div className="ci-field">
                        <label>Carbs (g)</label>
                        <input
                            {...register('carbs', {
                                required: 'Required',
                                pattern: { value: /^\d*\.?\d*$/, message: 'Numbers only' },
                            })}
                        />
                        {errors.carbs && <span className="error-message">{errors.carbs.message}</span>}
                    </div>

                    <div className="ci-field">
                        <label>Calories</label>
                        <input {...register('calories')} />
                    </div>
                </div>

                <button className="ci-submit" onClick={handleSubmit(onSubmit)} disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                </button>
                <button className="modal-close" onClick={onClose}>
                    x
                </button>

                {message && <div style={{ color: isSuccess ? '#059669' : '#f87171', marginTop: 10 }}>{message}</div>}
            </div>
        </div>
    );
};

export default CreateItemModal;
