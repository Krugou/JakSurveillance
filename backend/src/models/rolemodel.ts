import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../config/adminDBPool.js';

interface Role {
	roleid: number;
	rolename: string;
	// other fields...
}

interface RoleModel {
	findByRoleId(id: number): Promise<Role | null>;
	insertIntoRole(rolename: string): Promise<void>;
	fetchTeacherAndCounselorRoles(): Promise<RowDataPacket[]>;
	fetchAllRoles(): Promise<RowDataPacket[]>;
	// other methods...
}

const roleModel: RoleModel = {
	async fetchAllRoles() {
		try {
			const [results] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM roles');
			return results;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async fetchTeacherAndCounselorRoles() {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					"SELECT * FROM roles WHERE name IN ('teacher', 'counselor')",
				);
			return rows;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async findByRoleId(id) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM roles WHERE roleid = ?', [id]);
			return (rows[0] as Role) || null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async insertIntoRole(rolename) {
		try {
			await pool
				.promise()
				.query('INSERT INTO roles (rolename) VALUES (?)', [rolename]);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	// other methods...
};

export default roleModel;
