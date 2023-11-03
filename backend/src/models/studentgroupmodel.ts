import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

interface StudentGroup {
	studentgroupid: number;
	studentgroupname: string;
	// other fields...
}

interface StudentGroupModel {
	fetchAllStudentGroups(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByStudentGroupId(id: number): Promise<StudentGroup | null>;
	insertIntoStudentGroup(studentgroupname: string): Promise<void>;
	// other methods...
}

const StudentGroup: StudentGroupModel = {
	fetchAllStudentGroups() {
		return pool.promise().query<RowDataPacket[]>('SELECT * FROM studentgroup');
	},

	async findByStudentGroupId(id) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM studentgroup WHERE studentgroupid = ?',
				[id],
			);
		return (rows[0] as StudentGroup) || null;
	},

	async insertIntoStudentGroup(studentgroupname) {
		await pool
			.promise()
			.query('INSERT INTO studentgroup (studentgroupname) VALUES (?)', [
				studentgroupname,
			]);
	},
	// other methods...
};

export default StudentGroup;
