// attendanceRoutes.ts
import express, {Request, Response, Router} from 'express';
import Attendance from '../../models/attendancemodel.js'; // Adjust the path according to your project structure

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
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

export default router;