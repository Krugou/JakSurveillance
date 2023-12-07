import express, {Request, Response, Router} from 'express';
import createPool from '../config/createPool.js';
import serverSettingsModel from '../models/serversettingsmodel.js';
import usermodel from '../models/usermodel.js';
import checkUserRole from '../utils/checkRole.js';

const pool = createPool('ADMIN');
const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
	res.json(req.user);
});
router.get(
	'/students',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (_req: Request, res: Response) => {
		try {
			const users = await usermodel.fetchAllStudents();
			console.log(users, 'users');
			res.send(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.get('/getattendancethreshold', async (_req: Request, res: Response) => {
	try {
		const result = await serverSettingsModel.getAttentanceThreshold(pool); // replace with your actual function to get the threshold
		const threshold = result[0][0].attendancethreshold;
		res.send({attendancethreshold: threshold});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});
export default router;
