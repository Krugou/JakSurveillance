import {RowDataPacket} from 'mysql2';
import pool from '../config/adminDBPool.js';

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

	async insertUserCourse(userId: number, courseId: number) {
		const result = await pool
			.promise()
			.query('INSERT INTO usercourses (userid, courseid) VALUES (?, ?)', [
				userId,
				courseId,
			]);

		return result;
	},
};

export default usercoursesModel;
