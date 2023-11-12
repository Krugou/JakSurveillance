import {FieldPacket, ResultSetHeader, RowDataPacket} from 'mysql2';

import pool from '../config/adminDBPool.js'; // Adjust the path to your pool file

/**
 * @interface UserInfo
 * @description Defines the structure of the UserInfo object.
 */
// Define the structure of the UserInfo object
interface UserInfo {
	username: string;
	email: string;
	staff: number;
	first_name: string;
	last_name: string;
}
/**
 * @interface User
 * @description Defines the structure of the User object.
 */
interface User {
	username: string;
	email: string;
	staff: number;
	first_name: string;
	last_name: string;
}
/**
 * @description Creates a User Model object literal.
 */
const UserModel = {
	pool: pool,

	/**
	 * Updates the username of a user based on their email.
	 * @param {string} email - The email of the user to update.
	 * @param {string} newUsername - The new username to set for the user.
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the update was successful.
	 */
	updateUsernameByEmail: async (
		email: string,
		newUsername: string,
	): Promise<boolean> => {
		try {
			const [rows] = (await UserModel.pool
				.promise()
				.execute('UPDATE users SET username = ? WHERE email = ?', [
					newUsername,
					email,
				])) as unknown as [ResultSetHeader, FieldPacket[]];

			return rows.affectedRows > 0;
		} catch (error) {
			console.error(error);
			throw new Error('Database error');
		}
	},

	/**
	 * @method getAllUserInfo
	 * @description A method to retrieve user information based on a username.
	 * @param {string} username - The username of the user.
	 * @returns {Promise<UserInfo | null>} A promise that resolves to the user's information or null if the user is not found.
	 */
	getAllUserInfo: async (email: string): Promise<UserInfo | null> => {
		try {
			const [rows] = await UserModel.pool
				.promise()
				.query<RowDataPacket[]>(
					`SELECT users.userid, users.username, users.email, users.first_name, users.last_name, users.created_at, users.studentnumber, roles.name AS role FROM users JOIN roles ON users.roleid = roles.roleid WHERE users.email = "${email}"`,
				);

			if (rows.length > 0) {
				return rows.pop() as UserInfo;
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			throw new Error('Database error');
		}
	},

	/**
	 * Updates the email of a user.
	 * @param {number} userId - The ID of the user to update.
	 * @param {string} newEmail - The new email to set for the user.
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the update was successful.
	 */
	updateUserInfo: async (userId: number, newEmail: string): Promise<boolean> => {
		try {
			const [rows] = (await UserModel.pool.execute(
				'UPDATE users SET Useremail = ? WHERE Userid = ?',
				[newEmail, userId],
			)) as unknown as [ResultSetHeader, FieldPacket[]];

			return rows.affectedRows > 0;
		} catch (error) {
			console.error(error);
			throw new Error('Database error');
		}
	},
	/**
	 * Adds a new user to the database.
	 * @param {User} user - The user to add.
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the addition was successful.
	 */
	addUser: async (user: User): Promise<boolean> => {
		try {
			const {username, email, staff, first_name, last_name} = user;

			const [rows] = (await UserModel.pool.execute(
				'INSERT INTO users (username, email, staff, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
				[username, email, staff, first_name, last_name],
			)) as unknown as [ResultSetHeader, FieldPacket[]];

			return rows.affectedRows > 0;
		} catch (error) {
			console.error(error);
			throw new Error('Database error');
		}
	},
	/**
	 * Deletes a user by their ID.
	 * @param userId The ID of the user to delete.
	 * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
	 */
	async deleteUser(userId: number): Promise<boolean> {
		try {
			const [rows] = (await UserModel.pool.execute(
				'DELETE FROM users WHERE Userid = ?',
				[userId],
			)) as unknown as [ResultSetHeader, FieldPacket[]];

			return rows.affectedRows > 0;
		} catch (error) {
			console.error(error);
			throw new Error('Database error');
		}
	},
	/**
	 * Finds all users with a certain staff status.
	 * @param staff The staff status to search for.
	 * @returns A promise that resolves to an array of users with the given staff status.
	 */
	async findUsersByStaffStatus(staff: number): Promise<UserInfo[]> {
		try {
			const [rows] = await UserModel.pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM users WHERE staff = ?', [staff]);

			return rows as UserInfo[];
		} catch (error) {
			console.error(error);
			throw new Error('Database error');
		}
	},
	/**
	 * Checks if a username already exists in the database.
	 * @param username The username to check.
	 * @returns A promise that resolves to a boolean indicating whether the username exists.
	 */
	async checkUsernameExists(username: string): Promise<boolean> {
		try {
			const [rows] = await UserModel.pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [
					username,
				]);

			return rows.length > 0;
		} catch (error) {
			console.error(error);
			throw new Error('Database error');
		}
	},
};

export default UserModel;
