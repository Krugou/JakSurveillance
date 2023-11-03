import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';
/**
 * @interface Topic
 * @description Defines the structure of a Topic object.
 */
interface Topic {
	topicid: number;
	topicname: string;
	// other fields...
}
/**
 * @interface TopicModel
 * @description Defines the structure of a TopicModel object.
 */
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

/**
 * @description TopicModel implementation.
 */
const Topic: TopicModel = {
	/**
	 * @method fetchAllTopics
	 * @description Fetches all topics from the database.
	 * @returns {Promise<[RowDataPacket[], FieldPacket[]]>} A promise that resolves to an array of RowDataPacket and FieldPacket.
	 */
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
	/**
	 * @method findByTopicId
	 * @description Finds a topic by its ID.
	 * @param {number} id - The ID of the topic to find.
	 * @returns {Promise<Topic | null>} A promise that resolves to a Topic object or null if the topic is not found.
	 */
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
	/**
	 * @method insertIntoTopic
	 * @description Inserts a new topic into the database.
	 * @param {string} topicname - The name of the topic to insert.
	 * @returns {Promise<void>} A promise that resolves when the insertion is complete.
	 */
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
	/**
	 * @method checkIfTopicExists
	 * @description Checks if a topic exists in the database.
	 * @param {string} topicname - The name of the topic to check.
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the topic exists.
	 */
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
	/**
	 * @method updateTopicName
	 * @description Updates the name of a topic.
	 * @param {number} id - The ID of the topic to update.
	 * @param {string} topicname - The new name of the topic.
	 * @returns {Promise<void>} A promise that resolves when the update is complete.
	 */
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
	/**
	 * @method deleteByTopicId
	 * @description Deletes a topic by its ID.
	 * @param {number} id - The ID of the topic to delete.
	 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
	 */
	async deleteByTopicId(id) {
		try {
			await pool.promise().query('DELETE FROM topics WHERE topicid = ?', [id]);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	/**
	 * @method countTopics
	 * @description Counts the number of topics in the database.
	 * @returns {Promise<number>} A promise that resolves to the number of topics.
	 */
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