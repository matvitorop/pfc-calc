export interface fetchResponse<T> {
    data?: T;
    errors?: { message: string }[];
}

const GRAPHQL_API_URL = 'https://localhost:7049/graphql';

export const graphqlFetch = async <T>(
    query: string,
    variables: Record<string, unknown> = {},
    allowCredentials: boolean = false, //were true
): Promise<fetchResponse<T>> => {
    const response = await fetch(GRAPHQL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: allowCredentials ? 'include' : 'same-origin',
        body: JSON.stringify({ query, variables }),
    });

    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch {
        console.error('Non-JSON response:', text);
        throw new Error('Invalid JSON from server');
    }
};
