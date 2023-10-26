'use strict';
const loginUrl = 'https://streams.metropolia.fi/2.0/api/';

const doFetch = async (url: string, options: RequestInit) => {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        const message = data.error ? `${data.error}` : data.message;
        throw new Error(message || response.statusText);
    }

    return data;
};
interface LoginInputs {
    username: string;
    password: string;
}
const postLogin = async (inputs: LoginInputs) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: inputs.username, password: inputs.password }),
    };
    return await doFetch(loginUrl, options);
};

export default postLogin ;