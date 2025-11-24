import { useState, useEffect } from "react";
import "../../../css/searchItem.css";
import { graphqlFetch } from "../../GraphQL/fetchRequest";

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

interface Props {
    onClose: () => void;
}

const CreateItemModal = ({ onClose }: Props) => {
    const [name, setName] = useState("");
    const [proteins, setProteins] = useState<string>("");
    const [fats, setFats] = useState<string>("");
    const [carbs, setCarbs] = useState<string>("");
    const [calories, setCalories] = useState<string>("");
    const [description, setDescription] = useState("");

    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    // Auto-calc calories when user edits macros
    useEffect(() => {
        const p = Number(proteins);
        const f = Number(fats);
        const c = Number(carbs);

        if (!isNaN(p) && !isNaN(f) && !isNaN(c)) {
            const calculated = Math.round(p * 4 + f * 9 + c * 4);
            setCalories(calculated === 0 ? "" : String(calculated));
        }
    }, [proteins, fats, carbs]);

    const handleSubmit = async () => {
        setLoading(true);

        const res = await graphqlFetch<{
            addCustomItem: { success: boolean; message: string };
        }>(
            createCustomItemMutation,
            {
                item: {
                    name,
                    proteins: Number(proteins),
                    fats: Number(fats),
                    carbs: Number(carbs),
                    description,
                },
                calories: calories === "" ? null : Number(calories),
            },
            true
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
            setMessage(response?.message ?? "Error occurred");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card create-item-modal">
                <h2 className="modal-title">Create Custom Item</h2>

                <input
                    className="ci-input"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    className="ci-input"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="ci-fields-row">
                    <div className="ci-field">
                        <label>Proteins (g)</label>
                        <input value={proteins} onChange={(e) => setProteins(e.target.value)} />
                    </div>

                    <div className="ci-field">
                        <label>Fats (g)</label>
                        <input value={fats} onChange={(e) => setFats(e.target.value)} />
                    </div>

                    <div className="ci-field">
                        <label>Carbs (g)</label>
                        <input value={carbs} onChange={(e) => setCarbs(e.target.value)} />
                    </div>

                    <div className="ci-field">
                        <label>Calories</label>
                        <input
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                        />
                    </div>
                </div>

                <button className="ci-submit" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Adding..." : "Add"}
                </button>
                <button className="modal-close" onClick={onClose}>x</button>

                {message && (
                    <div style={{ color: isSuccess ? "green" : "red", marginTop: 10 }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateItemModal;