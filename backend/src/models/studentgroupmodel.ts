import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../config/adminDBPool.js';

interface StudentGroup {
	studentgroupid: number;
	studentgroupname: string;
	// other fields...
}

interface StudentGroupModel {
	fetchAllStudentGroups(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByStudentGroupId(id: number): Promise<StudentGroup | null>;
	insertIntoStudentGroup(studentgroupname: string): Promise<void>;
	checkIfGroupNameExists(group_name: string): Promise<RowDataPacket[] | null>;
	// other methods...
}

const StudentGroup: StudentGroupModel = {
	async fetchAllStudentGroups() {
		try {
			return await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM studentgroup');
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async checkIfGroupNameExists(group_name: string) {
		const [existingGroup] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM studentgroups WHERE group_name = ?', [
				group_name,
			]);

		return existingGroup;
	},

	async findByStudentGroupId(id) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT * FROM studentgroup WHERE studentgroupid = ?',
					[id],
				);
			return (rows[0] as StudentGroup) || null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async insertIntoStudentGroup(studentgroupname) {
		try {
			await pool
				.promise()
				.query('INSERT INTO studentgroup (studentgroupname) VALUES (?)', [
					studentgroupname,
				]);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	// other methods...
};

export default StudentGroup;
