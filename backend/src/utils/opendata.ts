import {config} from 'dotenv';
import doFetch from './doFetch.js';
config();
/**
 * Check reservations from open data.
 *
 * @param {string} code - The code of the realization.
 * @param {string} studentGroup - The student group.
 * @returns {Promise} The data from the API.
 */
const CheckOpenDataReservations = async (
  code?: string,
  studentGroup?: string,
) => {
  const url = 'https://opendata.metropolia.fi/r1/reservation/search';
  const body = JSON.stringify({
    ...(code ? {realization: [code]} : {}),
    ...(studentGroup ? {studentGroup: [studentGroup]} : {}),
  });

  const options = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(process.env.APIKEYMETROPOLIA || ''),
      'Content-Type': 'application/json',
    },
    body: body,
  };

  return await doFetch(url, options as any);
};
/**
 * Check realization from open data.
 *
 * @param {string} code - The code of the realization.
 * @returns {Promise} The data from the API.
 */
const checkOpenDataRealization = async (code: string) => {
  const url = 'https://opendata.metropolia.fi/r1/realization/search';
  const options = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(process.env.APIKEYMETROPOLIA || ''),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({codes: [code]}),
  };

  return await doFetch(url, options as any);
};
/**
 * Open data functions.
 */
const openData = {
  CheckOpenDataReservations,
  checkOpenDataRealization,
};
export default openData;
