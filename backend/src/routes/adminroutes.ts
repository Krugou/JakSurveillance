import express, {Request, Response, Router} from 'express';
import adminController from '../controllers/admincontroller.js';
import course from '../models/coursemodel.js';
import rolemodel from '../models/rolemodel.js';
import studentgroupmodel from '../models/studentgroupmodel.js';
import usermodel from '../models/usermodel.js';
import checkUserRole from '../utils/checkRole.js';
const router: Router = express.Router();
router.get(
	'/',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			return await adminController.getServerSettings(req as any, res as any);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.post(
	'/',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			return await adminController.updateServerSettings(req as any, res as any);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.get(
	'/rolesspecial',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			const roles = await rolemodel.fetchTeacherAndCounselorRoles();
			res.send(roles);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.get(
	'/roles',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			const roles = await rolemodel.fetchAllRoles();
			res.send(roles);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);

router.post(
	'/change-role',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			const {email, roleId} = req.body;
			await usermodel.changeRoleId(email, roleId);
			res.send({message: 'Role changed successfully'});
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.get(
	'/getusers',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			const users = await usermodel.fetchUsers();
			res.send(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.get(
	'/getuser/:userid',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			const {userid} = req.params;
			const user = await usermodel.fetchUserById(Number(userid));
			res.send(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.get(
	'/getcourses',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			const courses = await course.getCoursesWithDetails();
			res.send(courses);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.put(
	'/updateuser',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			const user = req.body;
			await usermodel.updateUser(user);
			res.send({message: 'User updated successfully'});
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.get(
	'/studentgroups',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			const groups = await studentgroupmodel.fetchAllStudentGroups();
			res.send(groups);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.get(
	'/checkstudentnumber/:studentnumber',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			const {studentnumber} = req.params;
			const existingStudentNumber = await usermodel.checkIfStudentNumberExists(
				studentnumber,
			);
			if (existingStudentNumber.length > 0) {
				res.send({exists: true});
			} else {
				res.send({exists: false});
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);

export default router;
