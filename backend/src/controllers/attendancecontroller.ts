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
			const courseId = await lectureModel.getCourseIDByLectureID(lectureid);
			const usercourseResult = await usercoursesModel.getUserCourseId(
				studentnumber,
				courseId,
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
				const courseId = await lectureModel.getCourseIDByLectureID(lectureid);
				const usercourseResult = await usercoursesModel.getUserCourseId(
					studentnumber,
					courseId,
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

	async updateAttendanceStatus(attendanceid: number, status: number) {
		try {
			await attendanceModel.updateAttendanceStatus(attendanceid, status);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},

	async getLecturesAndAttendancesByCourseId(courseid: number) {
		try {
			const lectures = await attendanceModel.getAttendaceByCourseId(courseid);
			return lectures;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async deleteAttendance(studentnumber, lectureid: number) {
		try {
			const courseId = await lectureModel.getCourseIDByLectureID(lectureid);
			const usercourseResult = await usercoursesModel.getUserCourseId(
				studentnumber,
				courseId,
			);

			if (!usercourseResult || usercourseResult.length === 0) {
				throw new Error(
					`Usercourse not found for the studentnumber: ${studentnumber}`,
				);
			}

			const usercourseid = usercourseResult[0].usercourseid;

			const deleteResult = await attendanceModel.deleteAttendance(
				usercourseid,
				lectureid,
			);

			if (!deleteResult || deleteResult.affectedRows === 0) {
				throw new Error('Failed to delete attendance');
			}

			return true;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default attendanceController;
