import {ResultSetHeader, RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';

const pool = createPool('ADMIN');
interface StudentGroup {
	studentgroupid: number;
	studentgroupname: string;
	// other fields...
}

interface StudentGroupModel {
	findByStudentGroupId(id: number): Promise<StudentGroup | null>;
	insertIntoStudentGroup(studentgroupname: string): Promise<{insertId: number}>;
	checkIfGroupNameExists(group_name: string): Promise<RowDataPacket[] | null>;
	fetchAllStudentGroups(): Promise<RowDataPacket[]>;
	// other methods...
}

const studentGroupModel: StudentGroupModel = {
	async fetchAllStudentGroups() {
		try {
			const [results] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM studentgroups');
			return results;
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
					'SELECT * FROM studentgroups WHERE studentgroupid = ?',
					[id],
				);
			return (rows[0] as StudentGroup) || null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async insertIntoStudentGroup(
		studentgroupname: string,
	): Promise<{insertId: number}> {
		try {
			const [fields] = await pool
				.promise()
				.query('INSERT INTO studentgroups (group_name) VALUES (?)', [
					studentgroupname,
				]);
			return {insertId: (fields as ResultSetHeader).insertId};
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	// other methods...
};

export default studentGroupModel;
