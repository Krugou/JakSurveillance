import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';
/**
 * @method countTopics
 * @description Counts the number of topics in the database.
 * @returns {Promise<number>} A promise that resolves to the number of topics.
 */
interface TopicGroup {
	topicgroupid: number;
	topicgroupname: string;
	// other fields...
}
/**
 * @interface TopicGroupModel
 * @description Defines the structure of a TopicGroupModel object.
 */
interface TopicGroupModel {
	fetchAllTopicGroups(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByTopicGroupId(id: number): Promise<TopicGroup | null>;
	insertIntoTopicGroup(topicgroupname: string): Promise<void>;
	// other methods...
}
/**
 * @description TopicGroupModel implementation.
 */
const TopicGroup: TopicGroupModel = {
	/**
	 * @method fetchAllTopicGroups
	 * @description Fetches all topic groups from the database.
	 * @returns {Promise<[RowDataPacket[], FieldPacket[]]>} A promise that resolves to an array of RowDataPacket and FieldPacket.
	 */
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
	/**
	 * @method findByTopicGroupId
	 * @description Finds a topic group by its ID.
	 * @param {number} id - The ID of the topic group to find.
	 * @returns {Promise<TopicGroup | null>} A promise that resolves to a TopicGroup object or null if the topic group is not found.
	 */
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
	/**
	 * @method insertIntoTopicGroup
	 * @description Inserts a new topic group into the database.
	 * @param {string} topicgroupname - The name of the topic group to insert.
	 * @returns {Promise<void>} A promise that resolves when the insertion is complete.
	 */
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
