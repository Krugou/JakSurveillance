import express, {Request, Response, Router} from 'express';
import adminController from '../controllers/admincontroller.js';
import course from '../models/coursemodel.js';
import rolemodel from '../models/rolemodel.js';
import usermodel from '../models/usermodel.js';
const router: Router = express.Router();
router.get('/', async (_req: Request, res: Response) => {
	try {
		return await adminController.getServerSettings(_req as any, res as any);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});
router.post('/', async (req: Request, res: Response) => {
	try {
		return await adminController.updateServerSettings(req as any, res as any);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});
router.get('/rolesspecial', async (_req: Request, res: Response) => {
	try {
		const roles = await rolemodel.fetchTeacherAndCounselorRoles();
		res.send(roles);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});
router.get('/roles', async (_req: Request, res: Response) => {
	try {
		const roles = await rolemodel.fetchAllRoles();
		res.send(roles);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});

router.post('/change-role', async (req: Request, res: Response) => {
	try {
		const {email, roleId} = req.body;
		await usermodel.changeRoleId(email, roleId);
		res.send({message: 'Role changed successfully'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});
router.get('/getusers', async (req: Request, res: Response) => {
	try {
		const users = await usermodel.fetchUsers();
		res.send(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});
router.get('/getuser/:userid', async (req: Request, res: Response) => {
	try {
		const {userid} = req.params;
		const user = await usermodel.fetchUserById(Number(userid));
		res.send(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});
router.get('/getcourses', async (req: Request, res: Response) => {
	try {
		const courses = await course.getCoursesWithDetails();
		res.send(courses);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});
router.put('/updateuser', async (req: Request, res: Response) => {
	try {
		const user = req.body;
		await usermodel.updateUser(user);
		res.send({message: 'User updated successfully'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});
export default router;
