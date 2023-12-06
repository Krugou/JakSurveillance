// attendanceRoutes.ts
import express, {Request, Response, Router} from 'express';
import attendanceController from '../../controllers/attendancecontroller.js';
import lectureController from '../../controllers/lecturecontroller.js';
import attendanceModel from '../../models/attendancemodel.js';
import lectureModel from '../../models/lecturemodel.js';
import checkUserRole from '../../utils/checkRole.js';

const router: Router = express.Router();

router.get('/', async (res: Response) => {
	try {
		const attendanceData = await attendanceModel.fetchAllAttendances();
		res.json(attendanceData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		const attendanceData = await attendanceModel.findByAttendanceId(id);
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
		let userid = Number(req.user?.userid);
		let userinfo;
		if (
			req.user?.role === 'teacher' ||
			req.user?.role === 'admin' ||
			req.user?.role === 'counselor'
		) {
			userinfo = await attendanceModel.getUserInfoByUserCourseId(id);
			userid = userinfo?.userid;
		}
		const attendanceData = await attendanceModel.findAllAttendancesByUserCourseId(
			id,
			userid,
		);
		attendanceData[0] && userinfo
			? (attendanceData[0].userinfo = userinfo)
			: null;
		res.json(attendanceData);
	} catch (err) {
		console.error(err);
		if (err instanceof Error) {
			res.status(500).send(`Server error: ${err.message}`);
		} else {
			res.status(500).send('Server error');
		}
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

		if (err instanceof Error) {
			// Now TypeScript knows that err is an Error object
			res.status(500).send(`Server error: ${err.message}`);
		} else {
			res.status(500).send('Server error');
		}
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
			const allStudentsInLecture = await lectureController.getStudentsInLecture(
				lectureid,
			);
			res.status(201).json(allStudentsInLecture);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	},
);
router.post('/delete/', async (req: Request, res: Response) => {
	try {
		const {studentnumber} = req.body;
		const lectureid = req.body.lectureid;
		await attendanceController.deleteAttendance(studentnumber, lectureid);
		res.status(201).send(true);
	} catch (err) {
		console.error(err);
		res.status(500).send(false);
	}
});

router.post('/deletelecture/', async (req: Request, res: Response) => {
	try {
		const {lectureid} = req.body;
		await lectureModel.deleteByLectureId(lectureid);
		res.status(201).send('Lecture deleted');
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
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

// router.get('/studentsattendance', async (req: Request, res: Response) => {
// 	try {
// 		const id = Number(req.params.id);
// 		const attendanceData = await attendanceModel.findAllAttendancesByUserCourseId(
// 			id,
// 		);
// 		res.json(attendanceData);
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).send('Server error');
// 	}
// });

router.put(
	'/update',
	checkUserRole(['admin', 'teacher', 'counselor']),
	async (req: Request, res: Response) => {
		const {attendanceid, status} = req.body;

		try {
			console.log('Received attendanceid:', attendanceid);
			console.log('Received status:', status);

			const result = await attendanceController.updateAttendanceStatus(
				attendanceid,
				status,
			);
			console.log('Update result:', result);

			res.status(200).json({message: 'Attendance status updated successfully'});
		} catch (error) {
			console.error(error);
			res.status(500).send('Server error');
		}
	},
);

router.get(
	'/course/:courseid',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (req: Request, res: Response) => {
		try {
			const courseid = req.params.courseid;

			const lecturesAndAttendancesData =
				await attendanceController.getLecturesAndAttendancesByCourseId(courseid);

			res.json(lecturesAndAttendancesData);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	},
);

export default router;
