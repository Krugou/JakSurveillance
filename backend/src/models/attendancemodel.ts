import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

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
}

const Attendance: AttendanceModel = {
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
				.query<RowDataPacket[]>(
					'SELECT * FROM attendance WHERE attendanceid = ?',
					[id],
				);
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

	async insertIntoAttendance(status, date, usercourseid, classid) {
		try {
			await pool
				.promise()
				.query(
					'INSERT INTO attendance (status, date, usercourseid, classid) VALUES (?, ?, ?, ?)',
					[status, date, usercourseid, classid],
				);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default Attendance;
