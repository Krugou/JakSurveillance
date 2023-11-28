// attendanceRoutes.ts
import express, {Request, Response, Router} from 'express';
import attendanceController from '../../controllers/attendancecontroller.js';
import lectureController from '../../controllers/lecturecontroller.js';
import Attendance from '../../models/attendancemodel.js'; // Adjust the path according to your project structure
import lectureModel from '../../models/lecturemodel.js';
import Usermodel from "../../models/usermodel";
import attendanceModel from "../../models/attendancemodel.js";

const router: Router = express.Router();

router.get('/', async (res: Response) => {
	try {
		const attendanceData = await Attendance.fetchAllAttendances();
		res.json(attendanceData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		const attendanceData = await Attendance.findByAttendanceId(id);
		if (attendanceData) {
			res.json(attendanceData);
		} else {
			res.status(404).send('Attendance not found');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.get('/usercourse/:id', async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		let userid = req.user.userid;
		let userinfo;
		if (
			req.user.role === 'teacher' ||
			req.user.role === 'admin' ||
			req.user.role === 'counselor'
		) {
			userinfo = await Attendance.getUserInfoByUserCourseId(id);
			userid = userinfo.userid;
		}
		const attendanceData = await Attendance.findAllAttendancesByUserCourseId(
			id,
			userid,
		);
		attendanceData[0] && userinfo
			? (attendanceData[0].userinfo = userinfo)
			: null;
		res.json(attendanceData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

router.post('/', async (req: Request, res: Response) => {
	try {
		const {status, date, studentnumber, lectureid} = req.body;

		// Validate request body
		if (!status || !date || !studentnumber || !lectureid) {
			return res.status(400).send('Missing required fields');
		}

		const insertedData = await attendanceController.insertIntoAttendance(
			status,
			date,
			studentnumber,
			lectureid,
		);
		// Send response back to client
		res.status(200).send(insertedData);
	} catch (err) {
		console.error(err);

		// Send more specific error message
		res.status(500).send(`Server error: ${err.message}`);
	}
});
router.post('/lecturefinished/', async (req: Request, res: Response) => {
	try {
		const {date, studentnumbers, lectureid} = req.body;
		console.log(
			'🚀 ~ file: attendanceRoutes.ts:75 ~ router.post ~ req.body:',
			req.body,
		);
		await attendanceController.checkAndInsertStatusNotPresentAttendance(
			date,
			studentnumbers,
			lectureid,
		);
		await lectureModel.updateLectureState(lectureid, 'closed');
		res
			.status(201)
			.send('Attendance put as not present for rest of students not present');
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.post(
	'/getallstudentsinlecture/',
	async (req: Request, res: Response) => {
		try {
			const {lectureid} = req.body;
			const allStudentsInLecture = await lectureModel.getStudentsByLectureId(
				lectureid,
			);
			res.status(201).json(allStudentsInLecture);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	},
);
router.post('/lecture/', async (req: Request, res: Response) => {
	try {
		const {topicname, coursecode, start_date, end_date, timeofday, state} =
			req.body;
		console.log(req.body);
		const lectureid = await lectureController.insertIntoLecture(
			topicname,
			coursecode,
			start_date,
			end_date,
			timeofday,
			state,
		);
		res.status(201).json({message: 'lecture created', lectureid});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.get('/lectureinfo/:lectureid', async (req: Request, res: Response) => {
	try {
		const {lectureid} = req.params;

		const lectureInfo = await lectureModel.getLectureWithCourseAndTopic(
			lectureid,
		);

		res.status(200).json(lectureInfo);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

router.get('/studentsattendance', async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		const attendanceData = await Attendance.findAllAttendancesByUserCourseId(id);
		res.json(attendanceData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

router.put('/usercourse/update-status/:usercourseid', async (req: Request, res: Response) => {
	const usercourseId = req.params.usercourseid;
	const { status } = req.body;

	try {
		console.log('Received usercourseId:', usercourseId);
		console.log('Received status:', status);

		// Log the SQL query
		const query = `UPDATE attendance SET status = ? WHERE usercourseid = ? ORDER BY date DESC LIMIT 1`;
		console.log('SQL Query:', query);

		await attendanceController.updateAttendanceStatus(usercourseId, status);
		res.status(200).json({ message: 'Attendance status updated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).send('Server error');
	}
});

export default router;
