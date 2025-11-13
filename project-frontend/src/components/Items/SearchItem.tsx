import React, { useEffect, useState, useRef } from "react";
import { fromEvent, debounceTime, distinctUntilChanged, map, switchMap, of, catchError } from "rxjs";
import { graphqlFetch } from "../../GraphQL/fetchRequest";
import ItemDetailsModal from "./ItemDetailsModal";

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

const SearchItem: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [results, setResults] = useState<ItemShort[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        if (!inputRef.current) return;

        const subscription = fromEvent<InputEvent>(inputRef.current, "input")
            .pipe(
                map((e) => (e.target as HTMLInputElement).value.trim()),
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((query) => {
                    if (!query) {
                        setResults([]);
                        return of(null);
                    }

                    setLoading(true);
                    setError(null);

                    return graphqlFetch<{ searchItems: ItemShort[] }>(
                        searchQuery,
                        { query },
                        true // include credentials
                    ).then((res) => {
                        setLoading(false);
                        if (res.errors) {
                            setError(res.errors[0].message);
                            return [];
                        }
                        return res.data?.searchItems ?? [];
                    }).catch((err) => {
                        setLoading(false);
                        setError(err.message);
                        return [];
                    });
                })
            )
            .subscribe((data) => {
                if (data) setResults(data);
                setOpen(true);
            });

        return () => subscription.unsubscribe();
    }, []);

    const openItemModal = async (id: number) => {
        setModalLoading(true);

        const res = await graphqlFetch<GetItemByIdResponse>(
            getItemByIdQuery,
            { id },
            true
        );

        setModalLoading(false);

        if (res.data?.getUserSearchedItemById) {
            setSelectedItem(res.data.getUserSearchedItemById);
        }
    };

    return (
        <div className="search-card">
            <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search items..."
                onFocus={() => results.length > 0 && setOpen(true)}
            />

            {loading && <div className="search-loading">Loading...</div>}
            {error && <div className="search-error">Error: {error}</div>}

            {open && results.length > 0 && (
                <ul className="search-results">
                    {results.map((item) => (
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

            {selectedItem && (
                <ItemDetailsModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onAdd={(id) => console.log("ADD ITEM:", id)}
                    onDelete={(id) => console.log("DELETE ITEM:", id)}
                />
            )}
        </div>
    );
};

export default SearchItem;