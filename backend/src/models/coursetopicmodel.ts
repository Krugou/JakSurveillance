import {RowDataPacket} from 'mysql2';
import pool from '../config/adminDBPool.js';
const coursetopicsModel = {
	async checkIfCourseTopicRelationExists(courseId: number, topicId: number) {
		const [existingCourseTopicRelation] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM coursetopics WHERE courseid = ? AND topicid = ?',
				[courseId, topicId],
			);

		return existingCourseTopicRelation;
	},

	async insertCourseTopic(courseId: number, topicId: number) {
		const result = await pool
			.promise()
			.query('INSERT INTO coursetopics (courseid, topicid) VALUES (?, ?)', [
				courseId,
				topicId,
			]);

		return result;
	},
};

export default coursetopicsModel;
