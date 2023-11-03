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
	fetchAllRoles() {
		return pool.promise().query<RowDataPacket[]>('SELECT * FROM roles');
	},

	async findByRoleId(id) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM roles WHERE roleid = ?', [id]);
		return (rows[0] as Role) || null;
	},

	async insertIntoRole(rolename) {
		await pool
			.promise()
			.query('INSERT INTO roles (rolename) VALUES (?)', [rolename]);
	},
	// other methods...
};

export default Role;
