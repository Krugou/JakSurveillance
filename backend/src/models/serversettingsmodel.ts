import {Pool, RowDataPacket} from 'mysql2';

// server settings model
const serverSettingsModel = {
	async getServerSettings(pool: Pool) {
		try {
			return await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM serversettings');
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async updateServerSettings(
		pool: Pool,
		speedofhash: number,
		leewayspeed: number,
		timeouttime: number,
		attendancethreshold: number,
	) {
		try {
			return await pool
				.promise()
				.query(
					'UPDATE serversettings SET speedofhash = ?, leewayspeed = ?, timeouttime = ?, attendancethreshold = ?',
					[speedofhash, leewayspeed, timeouttime, attendancethreshold],
				);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default serverSettingsModel;
