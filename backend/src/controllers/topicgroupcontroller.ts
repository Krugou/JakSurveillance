import TopicGroupModel from '../models/topicgroupmodel.js';
import UserModel from '../models/usermodel.js';

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
	async updateTopicGroup(
		topicGroup: string,
		topics: string[],
		instructorUserId: number,
	) {
		try {
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
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default TopicGroupController;
