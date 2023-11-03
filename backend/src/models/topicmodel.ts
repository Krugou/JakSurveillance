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
	async fetchAllTopics() {
		try {
			return await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM topics');
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async findByTopicId(id) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM topics WHERE topicid = ?', [id]);
			return (rows[0] as Topic) || null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async insertIntoTopic(topicname) {
		try {
			await pool
				.promise()
				.query('INSERT INTO topics (topicname) VALUES (?)', [topicname]);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async checkIfTopicExists(topicname) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM topics WHERE topicname = ?', [
					topicname,
				]);
			return rows.length > 0;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async updateTopicName(id, topicname) {
		try {
			await pool
				.promise()
				.query('UPDATE topics SET topicname = ? WHERE topicid = ?', [
					topicname,
					id,
				]);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async deleteByTopicId(id) {
		try {
			await pool.promise().query('DELETE FROM topics WHERE topicid = ?', [id]);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async countTopics() {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM topics');
			return rows[0].count;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	// other methods...
};

export default Topic;
