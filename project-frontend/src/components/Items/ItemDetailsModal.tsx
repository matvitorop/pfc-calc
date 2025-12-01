import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToSummary } from '../../store/reducers/summarySlice';
import '../../../css/modalWindow.css';
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
    onClose: () => void;
    onAdd: (id: number) => void;
    onDelete: (id: number) => void;
}

const ItemDetailsModal: React.FC<ItemDetailsProps> = ({ item, onClose }) => {
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const [weight, setWeight] = useState<number>(0);

    const handleExpand = () => setExpanded(true);

    const handleConfirmAdd = () => {
        dispatch(
            addItemToSummary({
                day: new Date().toISOString(),
                mealTypeId: 1,
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
            mealTypeId: 1,
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
                        <input
                            type="number"
                            className="input-weight"
                            placeholder="Enter weight in grams"
                            value={weight}
                            onChange={e => setWeight(Number(e.target.value))}
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
