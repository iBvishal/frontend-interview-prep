const BASE_URL = `https://jsonplaceholder.typicode.com`;

// query encoding is something which I would like to update
export async function fetchUtil(endpoint: string, query: string) {
    console.log('fetching......')
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}?q=${query}`);

        if (!response.ok) {
            throw new Error('Failed to fetch results');
        }

        return await response.json();
    } catch (error) {
        console.log('Error', error)
    }
}
