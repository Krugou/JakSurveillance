import {ResultSetHeader} from 'mysql2';

const courseinstructors = {
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

export default courseinstructors;
