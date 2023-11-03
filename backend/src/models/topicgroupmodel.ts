import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

interface TopicGroup {
	topicgroupid: number;
	topicgroupname: string;
	// other fields...
}

interface TopicGroupModel {
	fetchAllTopicGroups(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByTopicGroupId(id: number): Promise<TopicGroup | null>;
	insertIntoTopicGroup(topicgroupname: string): Promise<void>;
	// other methods...
}

const TopicGroup: TopicGroupModel = {
	fetchAllTopicGroups() {
		return pool.promise().query<RowDataPacket[]>('SELECT * FROM topicgroups');
	},

	async findByTopicGroupId(id) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM topicgroups WHERE topicgroupid = ?',
				[id],
			);
		return (rows[0] as TopicGroup) || null;
	},

	async insertIntoTopicGroup(topicgroupname) {
		await pool
			.promise()
			.query('INSERT INTO topicgroups (topicgroupname) VALUES (?)', [
				topicgroupname,
			]);
	},
	// other methods...
};

export default TopicGroup;
