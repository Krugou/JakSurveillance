import TopicGroupModel from '../models/topicgroupmodel.js';
import TopicInGroupModel from '../models/topicingroupmodel.js';
import TopicModel from '../models/topicmodel.js';
import UserModel from '../models/usermodel.js';
import usercourse_topicsModel from '../models/usercourse_topicsmodel.js';
import pool from '../config/adminDBPool.js';

const TopicGroupController = {
	async getAllUserTopicGroupsAndTopics(email: string) {
		try {
			const user = await UserModel.getAllUserInfo(email);
			const userid = user.userid;
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
				instructorUserId = user.userid;
			}
			if (topicGroup) {
				const newTopicGroup = await TopicGroupModel.insertTopicGroup(
					topicGroup,
					instructorUserId,
				);
				const topicGroupId = newTopicGroup.insertId;

				if (topics) {
					for (const topic of topics) {
						let topicId;
						const existingTopic = await TopicModel.checkIfTopicExists(topic);

						if (existingTopic.length > 0) {
							console.error('Topic already exists');
							topicId = existingTopic[0].topicid;
						} else {
							const newTopic = await TopicModel.insertTopic(topic);
							topicId = newTopic.insertId;
						}

						const topicGroupTopicRelationExists =
							await TopicInGroupModel.checkIfTopicInGroupExists(topicGroupId, topicId);

						if (topicGroupTopicRelationExists.length > 0) {
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
		const connection = await pool.promise().getConnection();

		try {
			await connection.beginTransaction();

			await usercourse_topicsModel.deleteUserCourseTopic(usercourseid, connection);

			for (const topic of topics) {
				let topicId;
				const existingTopic = await TopicModel.checkIfTopicExists(
					topic,
					connection,
				);

				if (existingTopic.length > 0) {
					topicId = existingTopic[0].topicid;
				} else {
					throw new Error('Topic does not exist');
				}

				await usercourse_topicsModel.insertUserCourseTopic(
					usercourseid,
					topicId,
					connection,
				);
			}

			await connection.commit();

			return {
				state: 'success',
				message: 'Topics updated for usercourseid: ' + usercourseid,
			};
		} catch (error) {
			await connection.rollback();
			console.error(error);
			return Promise.reject(error);
		} finally {
			connection.release();
		}
	},
};

export default TopicGroupController;
