import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToSummary } from '../../store/reducers/summarySlice';
import '../../../css/modalWindow.css';
import { type MealType } from '../../store/reducers/mealTypeSlice';
interface ItemDetailsProps {
    item: {
        id: number;
        userId: number;
        name: string;
        proteins: number;
        fats: number;
        carbs: number;
        description: string;
        apiId: number;
        calories: number;
    };
    mealTypes: MealType[];
    onClose: () => void;
    onAdd: (id: number) => void;
    onDelete: (id: number) => void;
}

const ItemDetailsModal: React.FC<ItemDetailsProps> = ({ item, mealTypes, onClose }) => {
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const [weightRaw, setWeightRaw] = useState<string>("");
    const [weight, setWeight] = useState<number>(0);
    const [mealTypeId, setMealTypeId] = useState<number>(mealTypes[0]?.id ?? 1);

    const handleExpand = () => setExpanded(true);

    const handleConfirmAdd = () => {
        dispatch(
            addItemToSummary({
                day: new Date().toISOString(),
                mealTypeId: mealTypeId,
                measurement: weight,
                item: {
                    id: item.id,
                    userId: item.userId,
                    name: item.name,
                    proteins: item.proteins,
                    fats: item.fats,
                    carbs: item.carbs,
                    description: item.description,
                    apiId: item.apiId,
                },
            }),
        );

        console.log('Dispatch addItemToSummary:', {
            id: item.id,
            weight,
            mealTypeId: mealTypeId,
        });

        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className={`modal-card ${expanded ? 'modal-expanded' : ''}`}>
                <h2 className="modal-title">{item.name}</h2>

                <div className="modal-section">
                    <div className="modal-row">
                        <span className="modal-label">Calories:</span>
                        <span className="modal-value">{item.calories ? `${item.calories} ccal/100g` : 'N/A'}</span>
                    </div>
                    <div className="modal-row">
                        <span className="modal-label">Proteins:</span>
                        <span className="modal-value">{item.proteins} g</span>
                    </div>
                    <div className="modal-row">
                        <span className="modal-label">Fats:</span>
                        <span className="modal-value">{item.fats} g</span>
                    </div>
                    <div className="modal-row">
                        <span className="modal-label">Carbs:</span>
                        <span className="modal-value">{item.carbs} g</span>
                    </div>

                    {item.description && <p className="modal-description">{item.description}</p>}
                </div>

                {!expanded ? (
                    <div className="modal-buttons">
                        <button className="btn-add" onClick={handleExpand}>
                            Add
                        </button>
                        <button className="btn-delete">Delete</button>
                    </div>
                ) : (
                        <div className="expanded-section">

                            <select
                                className="meal-select"
                                value={mealTypeId}
                                onChange={e => setMealTypeId(Number(e.target.value))}
                            >
                                {mealTypes.map(mt => (
                                    <option key={mt.id} value={mt.id}>
                                        {mt.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                inputMode="decimal"
                                className="input-weight"
                                placeholder="Enter weight in grams"
                                value={weightRaw}
                                onChange={(e) => {
                                    let raw = e.target.value;

                                    if (raw === "") {
                                        setWeightRaw("");
                                        setWeight(0);
                                        return;
                                    }

                                    raw = raw.replace(",", ".");

                                    if (/^\d*\.?\d*$/.test(raw)) {
                                        setWeightRaw(raw);

                                        if (raw !== "." && raw !== ".0" && raw !== "0.") {
                                            const num = Number(raw);
                                            if (!isNaN(num)) {
                                                setWeight(num);
                                            }
                                        }
                                    }
                                }}
                            />


                        <button className="btn-confirm" onClick={handleConfirmAdd}>
                            Confirm Add
                        </button>
                    </div>
                )}

                <button className="modal-close" onClick={onClose}>
                    x
                </button>
            </div>
        </div>
    );
};

export default ItemDetailsModal;