import {RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';
interface StudentAndTopics {
	first_name: string;
	last_name: string;
	userid: number;
}
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
	async getUserCourseByUsercourseid(usercourseid: number) {
		const [usercourseResult] = await pool
			.promise()
			.query('SELECT * FROM usercourses WHERE usercourseid = ?', usercourseid);
		return usercourseResult;
	},
	async deleteUserCourseByUsercourseid(usercourseid: number) {
		const result = await pool
			.promise()
			.query('DELETE FROM usercourses WHERE usercourseid = ?', usercourseid);
		return result;
	},
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
