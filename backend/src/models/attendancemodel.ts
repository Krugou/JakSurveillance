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

	insertAttendance: (
		status: string,
		date: string,
		usercourseid: number,
		classid: number,
	) => Promise<any>;
	checkAttendance: (usercourseid: number) => Promise<any>;
	getAttendanceById: (insertid: number) => Promise<any>;
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

	async findAllAttendancesByUserCourseId(usercourseId, userid) {
		try {
			console.log(userid, 'USERIDDD');
			const [rows] = await pool.promise().query<RowDataPacket[]>(
				`SELECT attendance.status, class.start_date, class.end_date, class.timeofday, topics.topicname, courses.name
            FROM attendance 
            JOIN class ON attendance.classid = class.classid
            JOIN topics ON class.topicid = topics.topicid
            JOIN courses ON class.courseid = courses.courseid
            JOIN usercourses ON attendance.usercourseid = usercourses.usercourseid
            WHERE attendance.usercourseid = ? AND usercourses.userid = ?;`,
				[usercourseId, userid],
			);
			console.log(rows);
			return rows;
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

	async getAttendanceByUserCourseIdDateClassId(
		usercourseid: number,
		date: string,
		classid: number,
	) {
		const [attendanceResult] = await pool
			.promise()
			.query(
				'SELECT * FROM attendance WHERE usercourseid = ? AND date = ? AND classid = ?',
				[usercourseid, date, classid],
			);
		return attendanceResult;
	},

	async insertAttendance(
		status: string,
		date: string,
		usercourseid: number,
		classid: number,
	) {
		if (!status || !date || !usercourseid || !classid) {
			throw new Error('Invalid parameters');
		}

		try {
			return await pool
				.promise()
				.query(
					'INSERT INTO attendance (status, date, usercourseid, classid) VALUES (?, ?, ?, ?)',
					[status, date, usercourseid, classid],
				);
		} catch (error) {
			console.error(error);
			throw new Error('Failed to insert attendance');
		}
	},
	async checkAttendance(usercourseid: number) {
		const [attendanceResultCheck] = await pool
			.promise()
			.query('SELECT * FROM attendance WHERE usercourseid = ?', [usercourseid]);
		return attendanceResultCheck;
	},
	async getAttendanceById(insertid: number) {
		const [attendanceResult] = await pool
			.promise()
			.query('SELECT * FROM attendance WHERE attendanceid = ?', [insertid]);
		return attendanceResult;
	},
};

export default attendanceModel;
