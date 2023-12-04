import {RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';

const pool = createPool('ADMIN');
const usercoursesModel = {
	async checkIfUserCourseExists(userId: number, courseId: number) {
		const [existingUserCourse] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM usercourses WHERE userid = ? AND courseid = ?',
				[userId, courseId],
			);

		return existingUserCourse;
	},
	async getUserCourseId(studentnumber: string, courseid: number) {
		const [usercourseResult] = await pool
			.promise()
			.query(
				'SELECT usercourseid FROM usercourses WHERE userid IN (SELECT userid FROM users WHERE studentnumber = ?) AND courseid = ?',
				[studentnumber, courseid],
			);
		return usercourseResult;
	},

	async insertUserCourse(userId: number, courseId: number) {
		const result = await pool
			.promise()
			.query('INSERT INTO usercourses (userid, courseid) VALUES (?, ?)', [
				userId,
				courseId,
			]);

		return result;
	},
	async deleteUserCourse(userId: number, courseId: number) {
		const result = await pool
			.promise()
			.query('DELETE FROM usercourses WHERE userid = ? AND courseid = ?', [
				userId,
				courseId,
			]);

		return result;
	},
};

export default usercoursesModel;
