import attendanceModel from '../models/attendancemodel.js';
import usercoursesModel from '../models/usercoursemodel.js';
const attendanceController: AttendanceController = {
	async insertIntoAttendance(status, date, studentnumber, classid) {
		try {
			const usercourseResult = await usercoursesModel.getUserCourseId(
				studentnumber,
			);

			if (usercourseResult.length === 0) {
				console.error('Usercourse not found for the studentnumber:', studentnumber);
				return Promise.reject('Usercourse not found');
			}

			const usercourseid = usercourseResult[0].usercourseid;
			const attendanceResultCheck = await attendanceModel.checkAttendance(
				usercourseid,
			);

			if (attendanceResultCheck.length > 0) {
				console.error(
					'Attendance already exists for the usercourseid:',
					usercourseid,
				);
				return Promise.reject('Attendance already exists');
			}

			const insertResult = await attendanceModel.insertAttendance(
				status,
				date,
				usercourseid,
				classid,
			);

			const attendanceResult = await attendanceModel.getAttendanceById(
				insertResult.insertId,
			);
			console.log(
				'🚀 ~ file: attendancecontroller.ts:37 ~ insertIntoAttendance ~ attendanceResult:',
				attendanceResult,
			);

			return attendanceResult[0];
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async checkAndInsertStatusNotPresentAttendance(date, studentnumbers, classid) {
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
					await attendanceModel.getAttendanceByUserCourseIdDateClassId(
						usercourseid,
						date,
						classid,
					);

				if (attendanceResult.length === 0) {
					await attendanceModel.insertAttendance(0, date, usercourseid, classid);
				}
			}
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default attendanceController;
