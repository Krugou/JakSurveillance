import {ResultSetHeader} from 'mysql2';
import createPool from '../config/createPool.js';

const pool = createPool('ADMIN');
const courseinstructorsModel = {
	async insertCourseInstructor(instructoruserid: number, courseId: number) {
		const [instructorResult] = await pool
			.promise()
			.query<ResultSetHeader>(
				'INSERT INTO courseinstructors (userid, courseid) VALUES (?, ?)',
				[instructoruserid, courseId],
			);

		return instructorResult;
	},
};

export default courseinstructorsModel;
