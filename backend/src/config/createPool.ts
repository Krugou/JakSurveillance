import {config} from 'dotenv';
import mysql, {Pool} from 'mysql2';

config();

type UserRole = 'ADMIN' | 'TEACHER' | 'COUNSELOR' | 'STUDENT';
/**
 * Creates a new MySQL connection pool with the given user role.
 * @param {UserRole} userRole - The role of the user for the database connection.
 * @returns {mysql.Pool} The created MySQL connection pool.
 * @throws {Error} Will throw an error if the user role is invalid.
 */
const createPool = (userRole: UserRole): Pool => {
	let user: string;
	let password: string;

	switch (userRole) {
		case 'ADMIN':
			user = process.env.DB_USER_ADMIN as string;
			password = process.env.DB_PASS_ADMIN as string;
			break;
		case 'TEACHER':
			user = process.env.DB_USER_TEACHER as string;
			password = process.env.DB_PASS_TEACHER as string;
			break;
		case 'COUNSELOR':
			user = process.env.DB_USER_COUNSELOR as string;
			password = process.env.DB_PASS_COUNSELOR as string;
			break;
		case 'STUDENT':
			user = process.env.DB_USER_STUDENT as string;
			password = process.env.DB_PASS_STUDENT as string;
			break;
		default:
			throw new Error(`Invalid user role: ${userRole}`);
	}

	return mysql.createPool({
		host: process.env.DB_HOST as string,
		user,
		password,
		database: process.env.DB_NAME as string,
		waitForConnections: true,
		connectionLimit: 10000,
		queueLimit: 0,
	});
};

export default createPool;
