// attendanceRoutes.ts
import express, {Request, Response, Router} from 'express';
import Attendance from '../../models/attendancemodel.js'; // Adjust the path according to your project structure

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
		const {status, date, usercourseid, classid} = req.body;
		await Attendance.insertIntoAttendance(status, date, usercourseid, classid);
		res.status(201).send('Attendance created');
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

export default router;
