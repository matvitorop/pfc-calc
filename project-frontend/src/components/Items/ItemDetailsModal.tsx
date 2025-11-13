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

const ItemDetailsModal: React.FC<ItemDetailsProps> = ({ item, onClose, onAdd, onDelete }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2 className="modal-title">{item.name}</h2>

                <div className="modal-section">
                    <div className="modal-row">
                        <span className="modal-label">Calories:</span>
                        <span className="modal-value">
                            {item.calories ? `${item.calories} ccal/100g` : "N/A"}
                        </span>
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

                    {item.description && (
                        <p className="modal-description">{item.description}</p>
                    )}
                </div>

                <div className="modal-buttons">
                    <button className="btn-add" onClick={() => onAdd(item.id)}>Add</button>
                    <button className="btn-delete" onClick={() => onDelete(item.id)}>Delete</button>
                </div>

                <button className="modal-close" onClick={onClose} aria-label="Close dialog">x</button>
            </div>
        </div>
    );
};

export default ItemDetailsModal;