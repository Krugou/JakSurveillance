import {Request, Response} from 'express';
import pool from '../config/adminDBPool.js';
import ServerSettingsModel from '../models/serversettingsmodel.js';
interface AdminController {
	getServerSettings: (_req: Request, res: Response) => Promise<any>;
	updateServerSettings: (req: Request, res: Response) => Promise<any>;
}
const adminController: AdminController = {
	async getServerSettings(_req: Request, res: Response) {
		try {
			const serverSettings = await ServerSettingsModel.getServerSettings(pool);
			res.status(200).send(serverSettings[0][0]);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
	async updateServerSettings(req: Request, res: Response) {
		try {
			const {speedofhash, leewayspeed, timeouttime, attendancethreshold} = req.body;
			await ServerSettingsModel.updateServerSettings(
				pool,
				speedofhash,
				leewayspeed,
				timeouttime,
				attendancethreshold,
			);
			res.status(200).send({message: 'Server settings updated successfully'});
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
};

export default adminController;
