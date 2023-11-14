import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../config/adminDBPool.js';

interface Attendance {
	attendanceid: number;
	studentid: number;
	courseid: number;
	attended: boolean;
}

interface AttendanceModel {
	fetchAllAttendances(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByAttendanceId(id: number): Promise<Attendance | null>;
	findAllAttendancesByUserCourseId(
		studentId: number,
	): Promise<[RowDataPacket[], FieldPacket[]]>;
	insertIntoAttendance(
		start_date: string,
		end_date: string,
		topicid: number,
		usercourseid: number,
	): Promise<void>;
	checkAndInsertAttendance: (
		date: string,
		studentnumbers: string[],
		classid: string,
	) => Promise<void>;
}

const attendanceModel: AttendanceModel = {
	async fetchAllAttendances() {
		try {
			return await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM attendance');
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async findByAttendanceId(id) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM attendance WHERE attendanceid = ?', [
					id,
				]);
			return (rows[0] as Attendance) || null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async findAllAttendancesByUserCourseId(usercourseId) {
		try {
			return await pool.promise().query<RowDataPacket[]>(
				`SELECT attendance.* 
                FROM attendance 
                WHERE attendance.usercourseid = ?`,
				[usercourseId],
			);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async insertIntoAttendance(status, date, studentnumber, classid) {
		try {
			// Find usercourseid based on studentnumber
			const [usercourseResult] = await pool
				.promise()
				.query(
					'SELECT usercourseid FROM usercourses WHERE userid IN (SELECT userid FROM users WHERE studentnumber = ?)',
					[studentnumber],
				);

			if (usercourseResult.length === 0) {
				// Handle the case where no usercourseid is found for the given studentnumber
				console.error('Usercourse not found for the studentnumber:', studentnumber);
				return Promise.reject('Usercourse not found');
			}

			const usercourseid = usercourseResult[0].usercourseid;

			// Check if attendance with usercourseid already exists
			const [attendanceResultCheck] = await pool
				.promise()
				.query('SELECT * FROM attendance WHERE usercourseid = ?', [usercourseid]);

			if (attendanceResultCheck.length > 0) {
				// Handle the case where attendance with usercourseid already exists
				console.error(
					'Attendance already exists for the usercourseid:',
					usercourseid,
				);
				return Promise.reject('Attendance already exists');
			}

			// Insert into attendance
			const [insertResult] = await pool
				.promise()
				.query(
					'INSERT INTO attendance (status, date, usercourseid, classid) VALUES (?, ?, ?, ?)',
					[status, date, usercourseid, classid],
				);

			// Get the inserted row
			const [attendanceResult] = await pool
				.promise()
				.query('SELECT * FROM attendance WHERE attendanceid = ?', [
					insertResult.insertId,
				]);

			// Return the inserted row
			return attendanceResult[0];
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async checkAndInsertAttendance(date, studentnumbers, classid) {
		try {
			for (const studentnumber of studentnumbers) {
				// Find usercourseid based on studentnumber
				const [usercourseResult] = await pool
					.promise()
					.query(
						'SELECT usercourseid FROM usercourses WHERE userid IN (SELECT userid FROM users WHERE studentnumber = ?)',
						[studentnumber],
					);

				if (usercourseResult.length === 0) {
					console.error(
						'Usercourse not found for the studentnumber:',
						studentnumber,
					);
					continue; // Skip to the next iteration
				}

				const usercourseid = usercourseResult[0].usercourseid;

				// Check if attendance with usercourseid, date, and classid already exists
				const [attendanceResult] = await pool
					.promise()
					.query(
						'SELECT * FROM attendance WHERE usercourseid = ? AND date = ? AND classid = ?',
						[usercourseid, date, classid],
					);

				if (attendanceResult.length === 0) {
					// If attendance does not exist, insert with status 0
					await pool
						.promise()
						.query(
							'INSERT INTO attendance (status, date, usercourseid, classid) VALUES (?, ?, ?, ?)',
							[0, date, usercourseid, classid],
						);
				}
			}
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default attendanceModel;
