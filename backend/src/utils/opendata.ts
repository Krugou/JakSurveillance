import { config } from 'dotenv';
import doFetch from './fetch.js';
config();


const CheckOpenDataReservations = async (code?: string, studentGroup?: string) => {

    const url = 'https://opendata.metropolia.fi/r1/reservations/search';
    const body = JSON.stringify({
        ...(code ? { codes: code } : {}),
        ...(studentGroup ? { studentGroups: studentGroup } : {}),
    });

    const options = {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(process.env.APIKEYMETROPOLIA || '').toString('base64'),
            'Content-Type': 'application/json',
        },
        body,
    };

    const response = await doFetch(url, options as any

    );

    if (!response.ok) {
        throw new Error(`Fetch request failed with status ${response.status}`);
    }

    const data = await response.json();

    return data;
};
const openData = {
    CheckOpenDataReservations,
};
export default openData;