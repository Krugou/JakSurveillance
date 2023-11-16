import {Request, Response} from 'express';
import pool from '../config/adminDBPool.js';
import ServerSettingsModel from '../models/serversettingsmodel.js';
interface AdminController {
	getServerSettings: (_req: Request, res: Response) => Promise<any>;
}
const adminController: AdminController = {
	async getServerSettings(_req: Request, res: Response) {
		try {
			const serverSettings = await ServerSettingsModel.getServerSettings(pool);
			res.status(200).send(serverSettings);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
};

export default adminController;
