import express, { Request, Response, Router } from 'express';
import { body, param } from 'express-validator';
import adminController from '../controllers/admincontroller.js';
import course from '../models/coursemodel.js';
import lectureModel from '../models/lecturemodel.js';
import rolemodel from '../models/rolemodel.js';
import studentgroupmodel from '../models/studentgroupmodel.js';
import usermodel from '../models/usermodel.js';
import checkUserRole from '../utils/checkRole.js';
import validate from '../utils/validate.js';
const router: Router = express.Router();
/**
 * Route that fetches the server settings.
 *
 * @returns {Promise<ServerSettings>} A promise that resolves with the server settings.
 */
router.get(
	'/',
	checkUserRole(['admin']),
	async (_req: Request, res: Response) => {
		try {
			const serverSettings = await adminController.getServerSettings();
			// console.log(
			// 	'🚀 ~ file: adminroutes.ts:15 ~ serverSettings:',
			// 	serverSettings,
			// );
			res.status(200).send(serverSettings[0][0]);
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	},
);
/**
 * Route that updates the server settings.
 *
 * @param {number} speedofhash - The speed of hash.
 * @param {number} leewayspeed - The leeway speed.
 * @param {number} timeouttime - The timeout time.
 * @param {number} attendancethreshold - The attendance threshold.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
router.post(
	'/',
	checkUserRole(['admin']),
	[
		body('speedofhash').isNumeric().withMessage('Speed of hash must be a number'),
		body('leewayspeed').isNumeric().withMessage('Leeway speed must be a number'),
		body('timeouttime').isNumeric().withMessage('Timeout time must be a number'),
		body('attendancethreshold')
			.isNumeric()
			.withMessage('Attendance threshold must be a number'),
	],
	validate,
	async (req: Request, res: Response) => {
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
/**
 * Route that fetches the teacher and counselor roles.
 *
 * @returns {Promise<Role[]>} A promise that resolves with the teacher and counselor roles.
 */
router.get(
	'/rolesspecial',
	checkUserRole(['admin', 'teacher', 'counselor']),
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
/**
 * Route that fetches all roles.
 *
 * @returns {Promise<Role[]>} A promise that resolves with all roles.
 */
router.get(
	'/roles',
	checkUserRole(['admin']),
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
/**
 * Route that changes the role of a user.
 *
 * @param {string} email - The email of the user.
 * @param {number} roleId - The new role ID.
 * @returns {Promise<void>} A promise that resolves when the role change is complete.
 */
router.post(
	'/change-role',
	checkUserRole(['admin', 'teacher', 'counselor']),
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('roleId').isNumeric().withMessage('Role ID must be a number'),
	],
	validate,
	async (req: Request, res: Response) => {
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
/**
 * Route that fetches all users.
 *
 * @returns {Promise<User[]>} A promise that resolves with all users.
 */
router.get(
	'/getusers',
	checkUserRole(['admin']),
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
/**
 * Route that fetches a user by their ID.
 *
 * @param {number} userid - The ID of the user.
 * @returns {Promise<User>} A promise that resolves with the user.
 */
router.get(
	'/getuser/:userid',
	checkUserRole(['admin']),
	[param('userid').isNumeric().withMessage('User ID must be a number')],
	validate,
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
/**
 * Route that inserts a new student user.
 *
 * @param {string} email - The email of the user.
 * @param {string} first_name - The first name of the user.
 * @param {string} last_name - The last name of the user.
 * @param {string} studentnumber - The student number of the user.
 * @param {number} studentGroupId - The student group id of the user.
 * @returns {Promise<ResultSetHeader>} A promise that resolves when the insertion is complete.
 */
router.post(
    '/insert-student-user/',
    checkUserRole(['admin']),
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('first_name').isString().withMessage('First name must be a string'),
        body('last_name').isString().withMessage('Last name must be a string'),
        body('studentnumber').isString().withMessage('Student number must be a string'),
       
    ],
    validate,
    async (req: Request, res: Response) => {
        const {email, first_name, last_name, studentnumber, studentGroupId} = req.body;
        try {
            const userResult = await usermodel.insertStudentUser(
                email,
                first_name,
                last_name,
                studentnumber,
                studentGroupId
            );
            res.status(200).send({message: 'Student user inserted successfully', userResult});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },
);
/** route that get all lectures */
router.get(
	'/alllectures/',
	checkUserRole(['admin']),
	async (_req: Request, res: Response) => {
		
		try {
			const lectures = await lectureModel.fetchAllLecturees();
			res.json(lectures);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	},
);
/**
 * Route that fetches all courses with their details.
 *
 * @returns {Promise<Course[]>} A promise that resolves with all courses.
 */
router.get(
	'/getcourses',
	checkUserRole(['admin']),
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
/**
 * Route that updates a user.
 *
 * @param {User} user - The updated user data.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
router.put(
	'/updateuser',
	checkUserRole(['admin']),
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
/**
 * Route that fetches all student groups.
 *
 * @returns {Promise<StudentGroup[]>} A promise that resolves with all student groups.
 */
router.get(
	'/studentgroups',
	checkUserRole(['admin']),
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
/**
 * Route that checks if a student number exists.
 *
 * @param {number} studentnumber - The student number to check.
 * @returns {Promise<{exists: boolean}>} A promise that resolves with a boolean indicating if the student number exists.
 */
router.get(
	'/checkstudentnumber/:studentnumber',
	checkUserRole(['admin']),
	[
		param('studentnumber')
			.isNumeric()
			.withMessage('Student number must be a number'),
	],
	validate,
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
/**
 * Route that fetches the counts of users for each role.
 *
 * @returns {Promise<{[role: string]: number}>} A promise that resolves with an object where the keys are role names and the values are the counts of users with that role.
 */
router.get(
	'/getrolecounts',
	checkUserRole(['admin']),
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
