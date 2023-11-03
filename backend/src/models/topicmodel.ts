import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

interface Topic {
	topicid: number;
	topicname: string;
	// other fields...
}

interface TopicModel {
	fetchAllTopics(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByTopicId(id: number): Promise<Topic | null>;
	insertIntoTopic(topicname: string): Promise<void>;
	// other methods...
}

const Topic: TopicModel = {
	fetchAllTopics() {
		return pool.promise().query<RowDataPacket[]>('SELECT * FROM topics');
	},

	async findByTopicId(id) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM topics WHERE topicid = ?', [id]);
		return (rows[0] as Topic) || null;
	},

	async insertIntoTopic(topicname) {
		await pool
			.promise()
			.query('INSERT INTO topics (topicname) VALUES (?)', [topicname]);
	},
	// other methods...
};

export default Topic;
