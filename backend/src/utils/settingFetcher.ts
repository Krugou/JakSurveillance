import doFetch from './doFetch.js';
import getToken from './getToken.js';
const settingFetcher = async () => {
	try {
		const token = await getToken();
		const response = await doFetch('http://localhost:3002/admin/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
		});
		console.log('Settings update Success' + ' ' + new Date().toISOString());
		const speedOfHashChange = response.speedofhash;
		const leewaytimes = response.leewayspeed;
		const timeout = response.timeouttime;
		return {speedOfHashChange, leewaytimes, timeout};
	} catch (error) {
		console.error(error);
	}
};

export default settingFetcher;
