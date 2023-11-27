import express, {Request, Response, Router} from 'express';
import usermodel from '../models/usermodel.js';
const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
	//console.log('🚀 ~ file: secureroutes.ts:8 ~ router.get ~ req.user:', req.user);
	res.json(req.user);
});
router.get('/students', async (req: Request, res: Response) => {
	try {
		console.log('asdasdad');
		console.log(req.user.role);
		if (
			req.user.role !== 'admin' &&
			req.user.role !== 'counselor' &&
			req.user.role !== 'teacher'
		) {
			console.log('forbidden');
			return res.status(403).json({message: 'Forbidden'});
		}
		const users = await usermodel.fetchAllStudents();
		console.log(users, 'users');
		res.send(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});

export default router;
