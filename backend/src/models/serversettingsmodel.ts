import {RowDataPacket} from 'mysql2';
import pool from '../config/adminDBPool.js';

// server settings model
const serverSettingsModel = {
	async getServerSettings() {
		try {
			return await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM serversettings');
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default serverSettingsModel;
