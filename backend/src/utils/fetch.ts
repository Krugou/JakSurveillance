import fetch, { RequestInit, Response } from 'node-fetch';

const doFetch = async (url: string, options: RequestInit = {}): Promise<any> => {
    if (!url) {
        throw new Error('URL is required');
    }

    let response: Response;
    try {
        response = await fetch(url, options);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Fetch failed: ${error.message}`);
        }
        throw error;
    }

    if (!response.ok) {
        const errorText = `HTTP error! status: ${response.status}`;
        console.error(errorText);
        throw new Error(errorText);
    }

    let data: any;
    try {
        data = await response.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Failed to parse response as JSON: ${error.message}`);
        }
        throw error;
    }

    return data;
};

export default doFetch;