import {RowDataPacket} from 'mysql2';
import pool from '../config/adminDBPool.js';

const topicsingroup = {
	async checkIfTopicInGroupExists(topicGroupId: number, topicId: number) {
		const [existingTopicInGroup] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM topicsingroup WHERE topicgroupid = ? AND topicid = ?',
				[topicGroupId, topicId],
			);

		return existingTopicInGroup;
	},

	async insertTopicInGroup(topicGroupId: number, topicId: number) {
		const result = await pool
			.promise()
			.query('INSERT INTO topicsingroup (topicgroupid, topicid) VALUES (?, ?)', [
				topicGroupId,
				topicId,
			]);

		return result;
	},
};

export default topicsingroup;
