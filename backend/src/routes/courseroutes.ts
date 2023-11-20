import {config} from 'dotenv';
import express, {Request, Response, Router} from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import openData from '../utils/opendata.js';
import topicRoutes from './course/topicRoutes.js';
config();
const upload = multer();
const router: Router = express.Router();

import courseController from '../controllers/coursecontroller.js';
import course from '../models/coursemodel.js';
import attendanceRoutes from './course/attendanceRoutes.js';
router.get('/', async (_req: Request, res: Response) => {
	try {
		const [rows] = await course.fetchAllCourses();
		res.send(rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.use('/attendance', attendanceRoutes);
router.use('/topics', topicRoutes);

router.post('/check', express.json(), async (req: Request, res: Response) => {
	const {codes} = req.body;

	try {
		const data = await openData.checkOpenDataRealization(codes);

		// Check if message is "No results"
		if ((data as {message?: string}).message === 'No results') {
			res.status(404).json({
				exists: false,
			});
			return;
		}

		res.status(200).json({
			exists: true,
		}); // send the data as the response
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('Internal server error');
	}
});
router.post('/checkreservations/', async (req: Request, res: Response) => {
	const {code = '', studentGroup = ''} = req.body;

	try {
		const reservations = await openData.CheckOpenDataReservations(
			code,
			studentGroup,
		);
		res.json(reservations);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.post('/create', async (req: Request, res: Response) => {
	const {
		courseName,
		courseCode,
		studentGroup,
		startDate,
		endDate,
		studentList,
		instructors,
		topicGroup,
		topics,
	} = req.body;

	try {
		const response = await courseController.insertIntoCourse(
			courseName,
			startDate,
			endDate,
			courseCode,
			studentGroup,
			studentList,
			instructors,
			topics,
			topicGroup,
		);
		console.log(
			'🚀 ~ file: courseroutes.ts:90 ~ router.post ~ response:',
			response,
		);
		res.status(200).send({
			message: 'File uploaded and data logged successfully',
			courseId: response,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: error.message,
		});
	}
});
router.post('/excelinput', upload.single('file'), async (req, res) => {
	if (!req.file) {
		console.error('No file uploaded');
		res.status(400).send('No file uploaded');
		return;
	}
	const {checkCourseDetails, instructorEmail} = req.body;
	// Read the Excel file from the buffer
	const workbook = XLSX.read(req.file.buffer, {type: 'buffer'});
	console.log('Loaded workbook'); // Debugging line

	// Get the first worksheet
	const worksheetName = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[worksheetName];

	if (!worksheet) {
		console.error('Worksheet not found');
		res.status(500).send('Internal server error');
		return;
	}
	const jsonData = XLSX.utils.sheet_to_json(worksheet);
	interface Item {
		__EMPTY: string;
		__EMPTY_1: string;
		__EMPTY_2: string;
		__EMPTY_3: string;
		__EMPTY_4: string;
		__EMPTY_5: string;
		__EMPTY_6: string;
		__EMPTY_7: string;
		__EMPTY_8: string;
		__EMPTY_9: string;
		[key: string]: string;
	}

	interface Student {
		first_name: string;
		last_name: string;
		name: string;
		email: string;
		studentnumber: string;
		arrivalgroup: string;
		admingroups: string;
		program: string;
		educationform: string;
		registration: string;
		evaluation: string;
	}

	interface CourseDetails {
		instructorEmail: string;
		startDate: Date;
		endDate: Date;
		studentGroup: string;
		courseName: string;
		courseCode: string;
		studentList: Student[];
	}
	interface IData {
		realizations: {
			startDate: string;
			endDate: string;
			studentGroups: {
				code: string;
			}[];
		}[];
	}
	const createCourse = (data: Item[]): CourseDetails => {
		const fullCourseName = Object.keys(data[0])[0]; // get the first key
		const [courseName, courseCode] = fullCourseName.split(' (');

		const studentList = data
			.filter(item => item.__EMPTY !== 'Etunimi')
			.map(item => {
				const first_name = item.__EMPTY;
				const last_name = item[fullCourseName];
				const name = item.__EMPTY_1;
				const email = item.__EMPTY_2;
				const studentnumber = item.__EMPTY_3;
				const arrivalgroup = item.__EMPTY_4;
				const admingroups = item.__EMPTY_5;
				const program = item.__EMPTY_6;
				const educationform = item.__EMPTY_7;
				const registration = item.__EMPTY_8;
				const evaluation = item.__EMPTY_9;

				return {
					first_name,
					last_name,
					name,
					email,
					studentnumber,
					arrivalgroup,
					admingroups,
					program,
					educationform,
					registration,
					evaluation,
				};
			});

		return {
			courseName,
			courseCode: courseCode.replace('(', '').replace(')', ''),
			studentList,
			instructorEmail: '', // default value
			startDate: new Date(), // default value
			endDate: new Date(), // default value
			studentGroup: '', // default value
		};
	};

	const courseDetails = createCourse(jsonData as Item[]);
	courseDetails.instructorEmail = instructorEmail;
	if (checkCourseDetails === 'true') {
		const data = (await openData.checkOpenDataRealization(
			courseDetails.courseCode,
		)) as IData;
		// Extract startDate and endDate from data and convert them to Date objects
		courseDetails.startDate = new Date(data.realizations[0].startDate);
		courseDetails.endDate = new Date(data.realizations[0].endDate);
		const studentGroup = data.realizations[0].studentGroups[0];
		courseDetails.studentGroup = studentGroup ? studentGroup.code : '';
	} else {
		courseDetails.studentGroup = 'please enter student group';
		courseDetails.startDate = new Date();
		courseDetails.endDate = new Date();
	}
	res.send(courseDetails);
});
router.get('/instructor/:email', async (req: Request, res: Response) => {
	try {
		const courses = await course.getCoursesByInstructorEmail(req.params.email);
		console.log(courses);

		res.send(courses);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.get('/coursesbyid/:id', async (req: Request, res: Response) => {
	try {
		const courseId = Number(req.params.id);
		if (isNaN(courseId)) {
			res.status(400).send('Invalid course ID');
			return;
		}
		const courses = await course.getCoursesByCourseId(courseId);
		res.json(courses);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
interface User {
	email: string;
	userrole: number;
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: User;
	}
}
router.get('/user/all', async (req: Request, res: Response) => {
	try {
		// Validate that the user is logged in
		if (!req.user) {
			res.status(403).send('User Info Unavailable');
			return;
		}

		// Get the email from the request
		const email = req.user.email;

		// Check if the user is an admin or the user is requesting their own info
		if (req.user.userrole !== 0 && req.user.email !== email) {
			return res.status(403).json({error: 'Access denied'});
		}

		// Get the courses for the user
		const courses = await course.getStudentsCourses(email);
		res.json(courses);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
export default router;
