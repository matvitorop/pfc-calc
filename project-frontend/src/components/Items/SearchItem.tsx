import React, { useEffect, useState, useRef } from "react";
import { fromEvent, debounceTime, distinctUntilChanged, map, switchMap, of, catchError } from "rxjs";
import { graphqlFetch } from "../../GraphQL/fecthRequest";

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

const SearchItem: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [results, setResults] = useState<ItemShort[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="container py-4">
            <h3 className="mb-3">Search Items</h3>
            <input
                ref={inputRef}
                type="text"
                className="form-control mb-3"
                placeholder="Type to search..."
            />

            {loading && <div>Loading...</div>}
            {error && <div className="text-danger">Error: {error}</div>}

            <ul className="list-group">
                {results.map((item) => (
                    <li key={item.id} className="list-group-item">
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchItem;