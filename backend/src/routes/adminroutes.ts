import express, {Request, Response, Router} from 'express';
import {body, validationResult} from 'express-validator';
import adminController from '../controllers/admincontroller.js';
import course from '../models/coursemodel.js';
import rolemodel from '../models/rolemodel.js';
import studentgroupmodel from '../models/studentgroupmodel.js';
import usermodel from '../models/usermodel.js';
import checkUserRole from '../utils/checkRole.js';
import validate from '../utils/validate.js';
const router: Router = express.Router();
router.get(
	'/',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (_req: Request, res: Response) => {
		try {
			const serverSettings = await adminController.getServerSettings();
			console.log(
				'🚀 ~ file: adminroutes.ts:15 ~ serverSettings:',
				serverSettings,
			);
			res.status(200).send(serverSettings[0][0]);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
router.post(
	'/',
	checkUserRole(['admin', 'counselor', 'teacher']),
	[
		body('speedofhash').isNumeric(),
		body('leewayspeed').isNumeric(),
		body('timeouttime').isNumeric(),
		body('attendancethreshold').isNumeric(),
	],
	validate,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({errors: errors.array()});
		}

		const {speedofhash, leewayspeed, timeouttime, attendancethreshold} = req.body;
		try {
			await adminController.updateServerSettings(
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
);
router.get(
	'/rolesspecial',
	checkUserRole(['admin', 'counselor', 'teacher']),
	validate,
	async (_req: Request, res: Response) => {
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
	async (_req: Request, res: Response) => {
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
	[body('email').isEmail(), body('roleId').isNumeric()],
	validate,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({errors: errors.array()});
		}

		const {email, roleId} = req.body;
		try {
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
	async (_req: Request, res: Response) => {
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
	async (_req: Request, res: Response) => {
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
	async (_req: Request, res: Response) => {
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
router.get(
	'/getrolecounts',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (_req: Request, res: Response) => {
		try {
			const roleCounts = await usermodel.getRoleCounts();
			res.send(roleCounts);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
export default router;
