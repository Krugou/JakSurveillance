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
	async fetchAllTopicGroups() {
		try {
			return await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM topicgroups');
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async findByTopicGroupId(id) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT * FROM topicgroups WHERE topicgroupid = ?',
					[id],
				);
			return (rows[0] as TopicGroup) || null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async insertIntoTopicGroup(topicgroupname) {
		try {
			await pool
				.promise()
				.query('INSERT INTO topicgroups (topicgroupname) VALUES (?)', [
					topicgroupname,
				]);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	// other methods...
};

export default TopicGroup;
