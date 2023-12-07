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

router.put('/accept-gdpr/:userid', async (req, res) => {
	const userId = Number(req.params.userid);
	console.log(userId, 'jotatjdkfgfdfd');
	try {
		const userId = req.user?.userid;
		await usermodel.updateUserGDPRStatus(userId);
		res.json({success: true});
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});
router.get(
	'/check-staff/:email',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		const email = req.params.email;
		try {
			const user = await usermodel.checkIfUserExistsByEmailAndisStaff(email);
			if (user.length > 0) {
				res.json({exists: true, user: user[0]});
			} else {
				res.json({exists: false});
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
export default router;
