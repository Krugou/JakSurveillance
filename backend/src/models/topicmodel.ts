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
	checkIfTopicExists(topicname: string): Promise<boolean>;
	updateTopicName(id: number, topicname: string): Promise<void>;
	deleteByTopicId(id: number): Promise<void>;
	countTopics(): Promise<number>;
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
	async checkIfTopicExists(topicname) {
		// new method
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM topics WHERE topicname = ?', [
				topicname,
			]);
		return rows.length > 0;
	},
	async updateTopicName(id, topicname) {
		await pool
			.promise()
			.query('UPDATE topics SET topicname = ? WHERE topicid = ?', [
				topicname,
				id,
			]);
	},

	async deleteByTopicId(id) {
		await pool.promise().query('DELETE FROM topics WHERE topicid = ?', [id]);
	},

	async countTopics() {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM topics');
		return rows[0].count;
	},
	// other methods...
};

export default Topic;
