import attendanceModel from '../models/attendancemodel.js';
import usercoursesModel from '../models/usercoursemodel.js';
interface AttendanceController {
	// Define the methods and properties here
}
const attendanceController: AttendanceController = {
	async insertIntoAttendance(
		status: string,
		date: Date,
		studentnumber: string,
		classid: string,
	) {
		try {
			if (!status || !date || !studentnumber || !classid) {
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
				classid,
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
					const status = 0;
					await attendanceModel.insertAttendance(
						status,
						date,
						usercourseid,
						classid,
					);
				}
			}
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default attendanceController;
