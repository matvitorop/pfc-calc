export interface Diet {
    id: number;
    name: string;
    description: string;
    proteinPerc: number;
    carbPerc: number;
    fatPerc: number;
}

const GRAPHQL_API_URL = '/graphql';

export async function fetchDiets(): Promise<Diet[]> {
    const query = `
        query{
            getDiets{
                id
                name
                description
                proteinPerc
                carbPerc
                fatPerc
            }
        }`;

    const response = await fetch(GRAPHQL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
    })

    const { data, errors } = await response.json();

    if (errors) {
        throw new Error(errors.map((err: any) => err.message).join(', '));
    }

    return data.getDiets;
}