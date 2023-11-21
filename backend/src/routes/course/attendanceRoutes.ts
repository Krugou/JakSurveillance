// attendanceRoutes.ts
import express, {Request, Response, Router} from 'express';
import attendanceController from '../../controllers/attendancecontroller.js';
import lectureController from '../../controllers/lecturecontroller.js';
import Attendance from '../../models/attendancemodel.js'; // Adjust the path according to your project structure
import lectureModel from '../../models/lecturemodel.js';

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
		const userid = req.user.userid;
		const attendanceData = await Attendance.findAllAttendancesByUserCourseId(
			id,
			userid,
		);
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
		await attendanceController.checkAndInsertStatusNotPresentAttendance(
			date,
			studentnumbers,
			lectureid,
		);
		res
			.status(201)
			.send('Attendance put as not present for rest of students not present');
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.post('/getallstudentsinlecture/', async (req: Request, res: Response) => {
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
});
router.post('/lecture/', async (req: Request, res: Response) => {
	try {
		const {topicname, coursecode, start_date, end_date, timeofday} = req.body;
		console.log(req.body);
		const lectureid = await lectureController.insertIntoLecture(
			topicname,
			coursecode,
			start_date,
			end_date,
			timeofday,
		);
		res.status(201).json({message: 'lecture created', lectureid});
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

export default router;
