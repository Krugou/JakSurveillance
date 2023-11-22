import TopicGroupModel from '../models/topicgroupmodel.js';
import UserModel from '../models/usermodel.js';

const TopicGroupController = {
	async getAllUserTopicGroupsAndTopics(email:string) {
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
};

export default TopicGroupController;
