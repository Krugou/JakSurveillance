import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

interface Role {
	roleid: number;
	rolename: string;
	// other fields...
}

interface RoleModel {
	fetchAllRoles(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByRoleId(id: number): Promise<Role | null>;
	insertIntoRole(rolename: string): Promise<void>;
	// other methods...
}

const Role: RoleModel = {
	async fetchAllRoles() {
		try {
			return await pool.promise().query<RowDataPacket[]>('SELECT * FROM roles');
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

export default Role;
