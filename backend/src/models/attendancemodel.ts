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
	findByAttendanceStudentId(
		studentId: number
	): Promise<[RowDataPacket[], FieldPacket[]]>;
}

const Attendance: AttendanceModel = {
	fetchAllAttendances() {
		return pool.promise().query<RowDataPacket[]>('SELECT * FROM attendance');
	},

	async findByAttendanceId(id) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM attendance WHERE attendanceid = ?',
				[id]
			);
		return (rows[0] as Attendance) || null;
	},

	findByAttendanceStudentId(studentId) {
		return pool.promise().query<RowDataPacket[]>(
			`SELECT attendance.* 
            FROM attendance 
            WHERE attendance.studentid = ?`,
			[studentId]
		);
	},
};

export default Attendance;
