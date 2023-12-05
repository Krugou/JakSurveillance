import createPool from '../config/createPool.js';
import ServerSettingsModel from '../models/serversettingsmodel.js';

const pool = createPool('ADMIN');

interface AdminController {
	getServerSettings: () => Promise<any>;
	updateServerSettings: (
		speedofhash: any,
		leewayspeed: any,
		timeouttime: any,
		attendancethreshold: any,
	) => Promise<any>;
}

const adminController: AdminController = {
	async getServerSettings() {
		try {
			const serverSettings = await ServerSettingsModel.getServerSettings(pool);
			return serverSettings; // use the serverSettings variable
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	async updateServerSettings(
		speedofhash,
		leewayspeed,
		timeouttime,
		attendancethreshold,
	) {
		try {
			await ServerSettingsModel.updateServerSettings(
				pool,
				speedofhash,
				leewayspeed,
				timeouttime,
				attendancethreshold,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};

export default adminController;
