import express, {Request, Response, Router} from 'express';
import usermodel from '../models/usermodel.js';
import checkUserRole from '../utils/checkRole.js';
const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
	//console.log('🚀 ~ file: secureroutes.ts:8 ~ router.get ~ req.user:', req.user);
	res.json(req.user);
});
router.get(
	'/students',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
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

export default router;
