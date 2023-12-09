import {RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';
/**
 * Interface for student and topics data.
 */
interface StudentAndTopics {
	first_name: string;
	last_name: string;
	userid: number;
}
const pool = createPool('ADMIN');
/**
 * Model for managing user courses.
 */
const usercoursesModel = {
	/**
	 * Checks if a user course exists.
	 * @param userId - The ID of the user.
	 * @param courseId - The ID of the course.
	 * @returns A promise that resolves to the existing user course, if any.
	 */
	async checkIfUserCourseExists(userId: number, courseId: number) {
		const [existingUserCourse] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM usercourses WHERE userid = ? AND courseid = ?',
				[userId, courseId],
			);

		return existingUserCourse;
	},
	/**
	 * Gets the ID of a user course.
	 * @param studentnumber - The student number.
	 * @param courseid - The ID of the course.
	 * @returns A promise that resolves to the ID of the user course.
	 */
	async getUserCourseId(studentnumber: string, courseid: number) {
		const [usercourseResult] = await pool
			.promise()
			.query(
				'SELECT usercourseid FROM usercourses WHERE userid IN (SELECT userid FROM users WHERE studentnumber = ?) AND courseid = ?',
				[studentnumber, courseid],
			);
		return usercourseResult;
	},
	/**
	 * Inserts a user course.
	 * @param userId - The ID of the user.
	 * @param courseId - The ID of the course.
	 * @returns A promise that resolves when the insertion is complete.
	 */
	async insertUserCourse(userId: number, courseId: number) {
		const result = await pool
			.promise()
			.query('INSERT INTO usercourses (userid, courseid) VALUES (?, ?)', [
				userId,
				courseId,
			]);

		return result;
	},
	/**
	 * Deletes a user course.
	 * @param userId - The ID of the user.
	 * @param courseId - The ID of the course.
	 * @returns A promise that resolves when the deletion is complete.
	 */
	async deleteUserCourse(userId: number, courseId: number) {
		const result = await pool
			.promise()
			.query('DELETE FROM usercourses WHERE userid = ? AND courseid = ?', [
				userId,
				courseId,
			]);

		return result;
	},
	/**
	 * Gets a user course by its ID.
	 * @param usercourseid - The ID of the user course.
	 * @returns A promise that resolves to the user course.
	 */
	async getUserCourseByUsercourseid(usercourseid: number) {
		const [usercourseResult] = await pool
			.promise()
			.query('SELECT * FROM usercourses WHERE usercourseid = ?', usercourseid);
		return usercourseResult;
	},
	/**
	 * Deletes a user course by its ID.
	 * @param usercourseid - The ID of the user course.
	 * @returns A promise that resolves when the deletion is complete.
	 */
	async deleteUserCourseByUsercourseid(usercourseid: number) {
		const result = await pool
			.promise()
			.query('DELETE FROM usercourses WHERE usercourseid = ?', usercourseid);
		return result;
	},
	/**
	 * Gets student information by user course ID.
	 * @param usercourseid - The ID of the user course.
	 * @returns A promise that resolves to the student information.
	 */
	async getStudentInfoByUsercourseid(usercourseid: number) {
		try {
			const [rows] = await pool.promise().query<RowDataPacket[]>(
				`SELECT 
					users.first_name,
					users.last_name,
					users.userid
				FROM users
				JOIN usercourses ON users.userid = usercourses.userid
				WHERE usercourses.usercourseid = ?
			`,
				[usercourseid],
			);

			const data: StudentAndTopics[] = JSON.parse(JSON.stringify(rows));
			return data;
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	},
};

export default usercoursesModel;
