import {RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';

const pool = createPool('ADMIN');
const topicsingroupModel = {
	async checkIfTopicInGroupExists(topicGroupId: number, topicId: number) {
		const [existingTopicInGroup] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM topicsingroup WHERE topicgroupid = ? AND topicid = ?',
				[topicGroupId, topicId],
			);

		console.log(
			'🚀 ~ file: topicingroupmodel.ts:14 ~ checkIfTopicInGroupExists ~ existingTopicInGroup:',
			existingTopicInGroup,
		);
		return existingTopicInGroup;
	},

	async insertTopicInGroup(topicGroupId: number, topicId: number) {
		console.log('inserting topic in group');
		console.log(topicGroupId, topicId);
		const [result] = await pool
			.promise()
			.query('INSERT INTO topicsingroup (topicgroupid, topicid) VALUES (?, ?)', [
				topicGroupId,
				topicId,
			]);

		return result;
	},
};

export default topicsingroupModel;
