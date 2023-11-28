import attendanceModel from '../models/attendancemodel.js';
import lectureModel from '../models/lecturemodel.js';
import usercoursesModel from '../models/usercoursemodel.js';
interface AttendanceController {
	insertIntoAttendance: (
		status: string,
		date: Date,
		studentnumber: string,
		lectureid: string,
	) => Promise<any>;
	checkAndInsertStatusNotPresentAttendance: (
		date: Date,
		studentnumbers: string[],
		lectureid: string,
	) => Promise<any>;
}
const attendanceController: AttendanceController = {
	async insertIntoAttendance(
		status: string,
		date: Date,
		studentnumber: string,
		lectureid: string,
	) {
		try {
			if (!status || !date || !studentnumber || !lectureid) {
				throw new Error('Invalid parameters');
			}

			const usercourseResult = await usercoursesModel.getUserCourseId(
				studentnumber,
			);

			if (!usercourseResult || usercourseResult.length === 0) {
				throw new Error(
					`Usercourse not found for the studentnumber: ${studentnumber}`,
				);
			}

			const usercourseid = usercourseResult[0].usercourseid;
			const attendanceResultCheck = await attendanceModel.checkAttendance(
				usercourseid,
				lectureid,
			);

			if (!attendanceResultCheck || attendanceResultCheck.length > 0) {
				throw new Error(
					`Attendance already exists for the usercourseid: ${usercourseid}`,
				);
			}

			const insertResult = await attendanceModel.insertAttendance(
				status,
				date,
				usercourseid,
				lectureid,
			);
			console.log(
				'🚀 ~ file: attendancecontroller.ts:42 ~ insertResult:',
				insertResult,
			);

			if (!insertResult || !insertResult[0] || !insertResult[0].insertId) {
				throw new Error('Failed to insert attendance');
			}

			const attendanceResult = await attendanceModel.getAttendanceById(
				insertResult[0].insertId,
			);

			if (!attendanceResult || attendanceResult.length === 0) {
				throw new Error(`Failed to get attendance by id: ${insertResult.insertId}`);
			}

			console.log('insertIntoAttendance ~ attendanceResult:', attendanceResult);

			return attendanceResult[0];
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	async checkAndInsertStatusNotPresentAttendance(
		date,
		studentnumbers,
		lectureid,
	) {
		try {
			for (const studentnumber of studentnumbers) {
				const usercourseResult = await usercoursesModel.getUserCourseId(
					studentnumber,
				);

				if (usercourseResult.length === 0) {
					console.error(
						'Usercourse not found for the studentnumber:',
						studentnumber,
					);
					continue;
				}

				const usercourseid = usercourseResult[0].usercourseid;

				const attendanceResult =
					await attendanceModel.getAttendanceByUserCourseIdDateLectureId(
						usercourseid,
						date,
						lectureid,
					);

				if (attendanceResult.length === 0) {
					const status = 0;
					await attendanceModel.insertAttendance(
						status,
						date,
						usercourseid,
						lectureid,
					);
				}
			}
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async updateAttendanceStatus(usercourseid: number, status: number) {
		try {
			await attendanceModel.updateAttendanceStatus(usercourseid, status);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},

	async getLecturesAndAttendancesByCourseId(courseid: number) {
		try {
			const lectures = await lectureModel.getLecturesByCourseId(courseid);
			const lecturesWithAttendances = await Promise.all(
				lectures.map(async lecture => {
					const attendances = await attendanceModel.getAttendaceByCourseId(
						lecture.lectureid,
					);
					return {
						...lecture,
						attendances,
					};
				}),
			);
			return lecturesWithAttendances;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default attendanceController;
