import {FieldPacket, ResultSetHeader, RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';

const pool = createPool('ADMIN');
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
	fetchAllTopicGroupsWithTopics(): Promise<RowDataPacket[]>;
	fetchAllTopicGroupsWithTopicsByUserId(
		userid: number,
	): Promise<RowDataPacket[]>;
	checkIfTopicGroupExists(topicgroup: string): Promise<RowDataPacket[]>;
	insertTopicGroup(
		topicgroup: string,
		topicgroupowner: number,
	): Promise<ResultSetHeader>;

	// other methods...
}
/**
 * @description TopicGroupModel implementation.
 */
const topicGroupModel: TopicGroupModel = {
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
	 * @method fetchAllTopicGroupsWithTopics
	 * @description Fetches all topic groups and their associated topics from the database.
	 * @returns {Promise<[RowDataPacket[], FieldPacket[]]>} A promise that resolves to an array of RowDataPacket and FieldPacket.
	 */
	async fetchAllTopicGroupsWithTopics() {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT topicgroups.topicgroupname, GROUP_CONCAT(topics.topicname) as topics FROM topicgroups LEFT JOIN topicsingroup ON topicgroups.topicgroupid = topicsingroup.topicgroupid LEFT JOIN topics ON topicsingroup.topicid = topics.topicid GROUP BY topicgroups.topicgroupid',
				);

			return rows;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async fetchAllTopicGroupsWithTopicsByUserId(userid: number) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT topicgroups.topicgroupname, GROUP_CONCAT(topics.topicname) as topics FROM topicgroups LEFT JOIN topicsingroup ON topicgroups.topicgroupid = topicsingroup.topicgroupid LEFT JOIN topics ON topicsingroup.topicid = topics.topicid WHERE topicgroups.userid = ? GROUP BY topicgroups.topicgroupid',
					[userid],
				);

			return rows;
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

	async checkIfTopicGroupExists(topicgroup: string) {
		const [existingTopic] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM topicgroups WHERE topicgroupname = ?',
				[topicgroup],
			);

		return existingTopic;
	},
	async insertTopicGroup(topicgroup: string, topicgroupowner: number) {
		const [topicResult] = await pool
			.promise()
			.query<ResultSetHeader>(
				'INSERT INTO topicgroups (topicgroupname, userid) VALUES (?, ?)',
				[topicgroup, topicgroupowner],
			);

		return topicResult;
	},

	// other methods...
};

export default topicGroupModel;
