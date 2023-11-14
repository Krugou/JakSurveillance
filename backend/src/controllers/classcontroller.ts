import classModel from '../models/classmodel.js';
import course from '../models/coursemodel.js';
import topicModel from '../models/topicmodel.js';

const classController = {
	async insertIntoClass(
		topicname: string,
		coursecode: string,
		start_date: Date,
		end_date: Date,
		timeofday: 'am' | 'pm',
	) {
		try {
			const topicId = await topicModel.findTopicIdUsingTopicName(topicname);
			console.log('🚀 ~ file: classmodel.ts:63 ~ topicRows:', topicId);

			const courseRows = await course.findCourseIdUsingCourseCode(coursecode);
			console.log('🚀 ~ file: classmodel.ts:70 ~ courseRows:', courseRows);

			if (topicId.length === 0 || courseRows.length === 0) {
				console.error(`Topic or course does not exist`);
				return;
			}

			const topicid = topicId[0].topicid;
			console.log('🚀 ~ file: classmodel.ts:78 ~ topicid:', topicid);
			const courseid = courseRows[0].courseid;
			console.log('🚀 ~ file: classmodel.ts:80 ~ courseid:', courseid);

			const result = await classModel.insertIntoClass(
				start_date,
				end_date,
				timeofday,
				topicid,
				courseid,
			);
			const classid = result.insertId;
			console.log('🚀 ~ file: classmodel.ts:88 ~ classid:', classid);
			return classid;
		} catch (error) {
			console.error(error);
		}
	},
};

export default classController;
