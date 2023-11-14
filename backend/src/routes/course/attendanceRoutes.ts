// attendanceRoutes.ts
import express, {Request, Response, Router} from 'express';
import Attendance from '../../models/attendancemodel.js'; // Adjust the path according to your project structure
import Class from '../../models/classmodel.js';
import classController from '../../controllers/classcontroller.js';

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
		const attendanceData = await Attendance.findAllAttendancesByUserCourseId(id);
		res.json(attendanceData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

router.post('/', async (req: Request, res: Response) => {
	try {
		const {status, date, studentnumber, classid} = req.body;

		const insertedData = await Attendance.insertIntoAttendance(
			status,
			date,
			studentnumber,
			classid,
		);
		console.log(insertedData);
		res.status(200).send(insertedData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.post('/classfinished/', async (req: Request, res: Response) => {
	try {
		const {date, studentnumbers, classid} = req.body;
		await Attendance.checkAndInsertAttendance(date, studentnumbers, classid);
		res
			.status(201)
			.send('Attendance put as not present for rest of students not present');
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.post('/getallstudentsinclass/', async (req: Request, res: Response) => {
	try {
		const {classid} = req.body;
		const allStudentsInClass = await Class.getStudentsByClassId(classid);
		res.status(201).json(allStudentsInClass);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.post('/class/', async (req: Request, res: Response) => {
	try {
		const {topicname, coursecode, start_date, end_date, timeofday} = req.body;
		console.log(req.body);
		const classid = await classController.insertIntoClass(
			topicname,
			coursecode,
			start_date,
			end_date,
			timeofday,
		);
		res.status(201).json({message: 'class created', classid});
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
