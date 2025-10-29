export interface ActivityCoefficient {
    id: number;
    name: string;
    value: number;
}

const GRAPHQL_API_URL = '/graphql';

export async function fetchActivityCoefficients(): Promise<ActivityCoefficient[]> {
    const query = `
        query{
            getCoef{
                id
                name
                value
            }
        }`;

    const response = await fetch(GRAPHQL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
    });

    const { data, errors } = await response.json();

    if (errors) {
        throw new Error(errors.map((err: any) => err.message).join(', '));
    }
    return data.getCoef;
}