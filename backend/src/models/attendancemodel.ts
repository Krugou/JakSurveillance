import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

interface Attendance {
	attendanceid: number;
	studentid: number;
	courseid: number;
	attended: boolean;
}

interface AttendanceModel {
	fetchAll(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findById(id: number): Promise<Attendance | null>;
	findByStudentId(studentId: number): Promise<[RowDataPacket[], FieldPacket[]]>;
}

const Attendance: AttendanceModel = {
	fetchAll() {
		return pool.promise().query<RowDataPacket[]>('SELECT * FROM attendance');
	},

	async findById(id) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM attendance WHERE attendanceid = ?',
				[id]
			);
		return (rows[0] as Attendance) || null;
	},

	findByStudentId(studentId) {
		return pool.promise().query<RowDataPacket[]>(
			`SELECT attendance.* 
            FROM attendance 
            WHERE attendance.studentid = ?`,
			[studentId]
		);
	},
};

export default Attendance;
