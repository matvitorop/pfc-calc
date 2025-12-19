import React, { useEffect, useState, useRef } from 'react';
import { fromEvent, debounceTime, distinctUntilChanged, map, switchMap, of } from 'rxjs';
import { graphqlFetch } from '../../GraphQL/fetchRequest';
import ItemDetailsModal from './ItemDetailsModal';
import '../../../css/searchItem.css';
import CreateItemModal from './CreateItemModal';
import { type MealType } from '../../store/reducers/mealTypeSlice';
interface ItemFull {
    id: number;
    userId: number;
    name: string;
    proteins: number;
    fats: number;
    carbs: number;
    description: string;
    apiId: number;
    calories: number;
}

interface GetItemByIdResponse {
    getUserSearchedItemById: ItemFull;
}

interface ItemShort {
    id: number;
    name: string;
}

const searchQuery = `
  query SearchItems($query: String!) {
    searchItems(query: $query) {
      id
      name
    }
  }
`;

const getItemByIdQuery = `
  query GetItem($id: Int!) {
    getUserSearchedItemById(id: $id) {
      id
      userId
      name
      proteins
      fats
      carbs
      description
      apiId
      calories
    }
  }
`;
interface SearchItemProps {
    mealTypes: MealType[];
    /*QUICK MODAL CHENGES*/
    defaultMealTypeId?: number;
    disableCreate?: boolean;
    onClose?: () => void;
}
/*QUICK MODAL CHENGES*/
const SearchItem: React.FC<SearchItemProps> = ({ mealTypes, defaultMealTypeId, disableCreate, onClose }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [results, setResults] = useState<ItemShort[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        if (!inputRef.current) return;

        const subscription = fromEvent<InputEvent>(inputRef.current, 'input')
            .pipe(
                map(e => (e.target as HTMLInputElement).value.trim()),
                debounceTime(300),
                distinctUntilChanged(),
                switchMap(query => {
                    if (!query) {
                        setResults([]);
                        return of(null);
                    }

                    setLoading(true);
                    setError(null);

                    return graphqlFetch<{ searchItems: ItemShort[] }>(searchQuery, { query }, true)
                        .then(res => {
                            setLoading(false);
                            if (res.errors) {
                                setError(res.errors[0].message);
                                return [];
                            }
                            return res.data?.searchItems ?? [];
                        })
                        .catch(err => {
                            setLoading(false);
                            setError(err.message);
                            return [];
                        });
                }),
            )
            .subscribe(data => {
                if (data) setResults(data);
                setOpen(true);
            });

        return () => subscription.unsubscribe();
    }, []);

    const openItemModal = async (id: number) => {
        setModalLoading(true);

        const res = await graphqlFetch<GetItemByIdResponse>(getItemByIdQuery, { id }, true);

        setModalLoading(false);

        if (res.data?.getUserSearchedItemById) {
            setSelectedItem(res.data.getUserSearchedItemById);
        }
    };

    const handleHideItem = (itemId: number) => {
        setResults(prev => prev.filter(i => i.id !== itemId));
        setSelectedItem(null);
    };

    return (
        <div className="search-card">
            <div className="search-input-row">
                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder="Search items..."
                    onFocus={() => results.length > 0 && setOpen(true)}
                />

                {!disableCreate && (
                    <button className="add-item-btn" onClick={() => setShowCreateModal(true)}>
                        +
                    </button>
                )}
            </div>

            {loading && <div className="search-loading">Loading...</div>}
            {error && <div className="search-error">Error: {error}</div>}

            {open && results.length > 0 && (
                <ul className="search-results">
                    {results.map(item => (
                        <li
                            key={item.id}
                            className="search-result-item"
                            onClick={() => {
                                setOpen(false);
                                openItemModal(item.id);
                            }}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}

            {modalLoading && <div className="search-loading">Loading item...</div>}
            { /*QUICK MODAL CHENGES*/ }
            {selectedItem && (
                <ItemDetailsModal
                    item={selectedItem}
                    mealTypes={mealTypes}
                    defaultMealTypeId={defaultMealTypeId} 
                    onClose={() => {
                        setSelectedItem(null);
                        if (onClose) onClose();
                    }}
                    onAdd={() => { }}
                    onDelete={handleHideItem}
                />
            )}

            {showCreateModal && <CreateItemModal onClose={() => setShowCreateModal(false)} />}
        </div>
    );
};

export default SearchItem;