import {RowDataPacket} from 'mysql2';
import pool from '../config/adminDBPool.js';

const usercourse_topicsModel = {
	async checkIfUserCourseTopicExists(usercourseid: number, topicId: number) {
		const [existingUserCourseTopic] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM usercourse_topics WHERE usercourseid = ? AND topicid = ?',
				[usercourseid, topicId],
			);

		return existingUserCourseTopic;
	},

	async deleteUserCourseTopic(usercourseid: number, connection: any) {
		let result;

		if (connection) {
			result = await connection.query(
				'DELETE FROM usercourse_topics WHERE usercourseid = ?',
				[usercourseid],
			);
		} else {
			result = await pool
				.promise()
				.query('DELETE FROM usercourse_topics WHERE usercourseid = ?', [
					usercourseid,
				]);
		}

		return result;
	},

	async insertUserCourseTopic(
		usercourseid: number,
		topicId: number,
		connection: any,
	) {
		let result;

		if (connection) {
			result = await connection.query(
				'INSERT INTO usercourse_topics (usercourseid, topicid) VALUES (?, ?)',
				[usercourseid, topicId],
			);
		} else {
			result = await pool
				.promise()
				.query(
					'INSERT INTO usercourse_topics (usercourseid, topicid) VALUES (?, ?)',
					[usercourseid, topicId],
				);
		}

		return result;
	},
};

export default usercourse_topicsModel;
