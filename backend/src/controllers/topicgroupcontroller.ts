import {RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';
import TopicGroupModel from '../models/topicgroupmodel.js';
import TopicInGroupModel from '../models/topicingroupmodel.js';
import TopicModel from '../models/topicmodel.js';
import usercourse_topicsModel from '../models/usercourse_topicsmodel.js';
import UserModel from '../models/usermodel.js';

const pool = createPool('ADMIN');
const TopicGroupController = {
	async getAllUserTopicGroupsAndTopics(email: string) {
		try {
			const user = await UserModel.getAllUserInfo(email);
			if (!user) {
				throw new Error('User not found');
			}
			const userid = user.userid;
			if (userid === undefined) {
				throw new Error('User id is undefined');
			}
			const topicGroups =
				await TopicGroupModel.fetchAllTopicGroupsWithTopicsByUserId(userid);
			return topicGroups;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async updateTopicGroup(topicGroup: string, topics: string[], email: string) {
		try {
			let instructorUserId;
			if (email) {
				const user = await UserModel.getAllUserInfo(email);
				if (!user) {
					throw new Error('User not found');
				}
				instructorUserId = user.userid;
			}
			if (topicGroup) {
				let topicGroupId;
				if (instructorUserId !== undefined) {
					const newTopicGroup = await TopicGroupModel.insertTopicGroup(
						topicGroup,
						instructorUserId,
					);
					topicGroupId = newTopicGroup.insertId;
				} else {
					throw new Error('Instructor user ID is undefined');
				}

				if (topics) {
					for (const topic of topics) {
						let topicId;
						const existingTopic = await TopicModel.checkIfTopicExists(topic);

						if (existingTopic && existingTopic.length > 0) {
							console.error('Topic already exists');
							topicId = existingTopic[0].topicid;
						} else {
							const newTopic = await TopicModel.insertTopic(topic);
							if (!newTopic) {
								throw new Error('Failed to insert new topic');
							}
							topicId = newTopic.insertId;
						}

						const topicGroupTopicRelationExists =
							await TopicInGroupModel.checkIfTopicInGroupExists(topicGroupId, topicId);

						if (
							topicGroupTopicRelationExists &&
							topicGroupTopicRelationExists.length > 0
						) {
							console.error('Topic group relation exists');
						} else {
							await TopicInGroupModel.insertTopicInGroup(topicGroupId, topicId);
						}
					}
				}
			}
			return {
				state: 'success',
				message:
					'Topic group entered for userid: ' +
					instructorUserId +
					' with topicgroupname: ' +
					topicGroup,
				email: email,
			};
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async updateUserCourseTopics(usercourseid: number, topics: string[]) {
		// Get a connection from the pool
		const connection = await pool.promise().getConnection();

		try {
			await connection.beginTransaction();

			// Delete all existing topics for the usercourseid
			await usercourse_topicsModel.deleteUserCourseTopic(usercourseid, connection);
			// Insert the new topics for the usercourseid
			for (const topic of topics) {
				let topicId;
				const [existingTopic] = await connection.query<RowDataPacket[]>(
					'SELECT * FROM topics WHERE topicname = ?',
					[topic],
				);
				// If the topic exists, get the topicid
				if (existingTopic && existingTopic.length > 0) {
					topicId = existingTopic[0].topicid;
				} else {
					throw new Error('Topic does not exist');
				}
				// Insert the topic for the usercourseid
				await usercourse_topicsModel.insertUserCourseTopic(
					usercourseid,
					topicId,
					connection,
				);
			}
			// Commit the transaction
			await connection.commit();
			// Return a success message
			return {
				state: 'success',
				message: 'Topics updated for usercourseid: ' + usercourseid,
			};
		} catch (error) {
			// Rollback the transaction if there is an error
			await connection.rollback();
			console.error(error);
			return Promise.reject(error);
		} finally {
			connection.release();
		}
	},
	async checkIfTopicGroupExistsWithEmail(topicGroup: string, email: string) {
		try {
			let instructorUserId;
			if (email) {
				const user = await UserModel.getAllUserInfo(email);
				if (!user) {
					throw new Error('User not found');
				}
				instructorUserId = user.userid;
			}
			if (topicGroup && instructorUserId) {
				const existingTopicGroup = await TopicGroupModel.checkIfTopicGroupExists(
					topicGroup,
					instructorUserId,
				);
				if (existingTopicGroup && existingTopicGroup.length > 0) {
					return true;
				}
			}
			return false;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default TopicGroupController;
