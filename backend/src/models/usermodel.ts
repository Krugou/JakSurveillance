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
	studentgroup?: string;
	group_name?: string | null;
	userid?: number;
	studentnumber?: string;
	role?: string;
	gdpr?: number;
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
	studentgroup?: string;
	group_name?: string | null;
	userid?: number;
	studentnumber?: string;
	roleid: number;
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
		let userData: UserInfo | null = null;
		try {
			const [userRows] = await UserModel.pool
				.promise()
				.query<RowDataPacket[]>(
					`SELECT users.userid, users.username, users.email, users.first_name, users.last_name, users.created_at, users.studentnumber, users.gdpr AS gdpr, roles.name AS role FROM users JOIN roles ON users.roleid = roles.roleid WHERE users.email = ?;`,
					[email],
				);

			if (userRows.length > 0) {
				userData = userRows.pop() as UserInfo;

				const [groupRows] = await UserModel.pool
					.promise()
					.query<RowDataPacket[]>(
						`SELECT studentgroups.group_name FROM studentgroups JOIN users ON users.studentgroupid = studentgroups.studentgroupid WHERE users.userid = ?;`,
						[userData.userid],
					);

				if (groupRows.length > 0) {
					userData.group_name = groupRows[0].group_name;
				} else {
					userData.group_name = 'not assigned';
				}
			}
			return userData || null;
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
	addStaffUser: async (user: User): Promise<unknown> => {
		try {
			const {username, email, staff, first_name, last_name, roleid} = user;
			(await UserModel.pool.execute(
				'INSERT INTO users (username, email, staff, first_name, last_name, roleid) VALUES (?, ?, ?, ?, ?, ?)',
				[username, email, staff, first_name, last_name, roleid],
			)) as unknown as [ResultSetHeader, FieldPacket[]];
			return;
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
	async checkIfEmailMatchesStaff(instructoremail: string) {
		const [existingInstructor] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM users WHERE email = ? AND staff = 1',
				[instructoremail],
			);

		return existingInstructor;
	},
	async checkIfUserExistsByStudentNumber(studentnumber: string) {
		const [existingUserByNumber] = await this.pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM users WHERE studentnumber = ?', [
				studentnumber,
			]);

		return existingUserByNumber;
	},
	async checkIfUserExistsByEmail(email: string) {
		const [existingUserByEmail] = await this.pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);

		return existingUserByEmail;
	},
	async checkIfUserExistsByEmailAndisStaff(email: string) {
		const [existingUserByEmail] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM users WHERE email = ? AND staff = 1',
				[email],
			);

		return existingUserByEmail;
	},
	async updateUserStudentNumber(studentnumber: string, email: string) {
		const result = await this.pool
			.promise()
			.query('UPDATE users SET studentnumber = ? WHERE email = ?', [
				studentnumber,
				email,
			]);

		return result;
	},
	async insertStudentUser(
		email: string,
		first_name: string,
		last_name: string,
		studentnumber: string,
		studentGroupId: number,
	) {
		const [userResult] = await this.pool
			.promise()
			.query<ResultSetHeader>(
				'INSERT INTO users (email, first_name, last_name, studentnumber, studentgroupid) VALUES (?, ?, ?, ?, ?)',
				[email, first_name, last_name, studentnumber, studentGroupId],
			);

		return userResult;
	},
	getStudentsByInstructorId: async (userid: number): Promise<UserInfo[]> => {
		try {
			const [rows] = await UserModel.pool.promise().query<RowDataPacket[]>(
				`SELECT DISTINCT u.*, studentgroups.group_name
          FROM users u
					JOIN studentgroups ON u.studentgroupid = studentgroups.studentgroupid
          JOIN usercourses uc ON u.userid = uc.userid
          JOIN courses c ON uc.courseid = c.courseid
          JOIN courseinstructors ci ON c.courseid = ci.courseid
          WHERE ci.userid = ? AND u.roleid = 1;`,
				[userid],
			);

			return rows as UserInfo[];
		} catch (error) {
			console.error(error);
			throw new Error('Database error');
		}
	},
	changeRoleId: async (email: string, roleId: number) => {
		console.log('🚀 ~ file: usermodel.ts:269 ~ changeRoleId: ~ roleId:', roleId);
		console.log('🚀 ~ file: usermodel.ts:269 ~ changeRoleId: ~ email:', email);
		try {
			const [result] = await pool
				.promise()
				.query<ResultSetHeader>('UPDATE users SET roleid = ? WHERE email = ?', [
					roleId,
					email,
				]);
			console.log('🚀 ~ file: usermodel.ts:276 ~ changeRoleId: ~ result:', result);
			return result;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	fetchUsers: async () => {
		try {
			const [result] = await pool
				.promise()
				.query<RowDataPacket[]>(
					`SELECT u.userid, u.username, u.email, u.first_name, u.last_name, u.studentnumber, u.staff, u.roleid, r.name AS role FROM users u JOIN roles r ON u.roleid = r.roleid;`,
				);
			return result;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	fetchUserById: async (userid: number) => {
		try {
			const [result] = await pool
				.promise()
				.query<RowDataPacket[]>(
					`SELECT u.*, r.name AS role FROM users u JOIN roles r ON u.roleid = r.roleid WHERE u.userid = ?;`,
					[userid],
				);
			return result;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	/**
	 * Updates the GDPR status of a user based on their user ID.
	 * @param {number} userId - The ID of the user to update.
	 * @param {number} gdprStatus - The new GDPR status to set for the user (0 or 1).
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the update was successful.
	 */
	updateUserGDPRStatus: async (userId: number): Promise<boolean> => {
		try {
			const [rows] = (await UserModel.pool
				.promise()
				.execute('UPDATE users SET gdpr = 1 WHERE userid = ?', [
					userId,
				])) as unknown as [ResultSetHeader, FieldPacket[]];

			return rows.affectedRows > 0;
		} catch (error) {
			console.error(error);
			throw new Error('Database error');
		}
	},

	/**
	 * Gets the GDPR status of a user based on their user ID.
	 * @param {number} userId - The ID of the user to check.
	 * @returns {Promise<number>} A promise that resolves to the user's GDPR status (0 or 1).
	 */
	getUserGDPRStatus: async (userId: number): Promise<number> => {
		try {
			const [rows] = await UserModel.pool
				.promise()
				.query<RowDataPacket[]>('SELECT gdpr FROM users WHERE userid = ?', [
					userId,
				]);

			if (rows.length > 0) {
				return rows[0].gdpr;
			} else {
				throw new Error('User not found');
			}
		} catch (error) {
			console.error(error);
			throw new Error('Database error');
		}
	},
};

export default UserModel;
