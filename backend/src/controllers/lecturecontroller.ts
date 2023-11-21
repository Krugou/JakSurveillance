import course from '../models/coursemodel.js';
import lectureModel from '../models/lecturemodel.js';
import topicModel from '../models/topicmodel.js';

const lectureController = {
	async insertIntoLecture(
		topicname: string,
		coursecode: string,
		start_date: Date,
		end_date: Date,
		timeofday: 'am' | 'pm',
		state: 'open' | 'closed',
	) {
		try {
			const topicId = await topicModel.findTopicIdUsingTopicName(topicname);
			// console.log('🚀 ~ file: lecturemodel.ts:63 ~ topicRows:', topicId);

			const courseRows = await course.findCourseIdUsingCourseCode(coursecode);
			// console.log('🚀 ~ file: lecturemodel.ts:70 ~ courseRows:', courseRows);

			if (topicId.length === 0 || courseRows.length === 0) {
				console.error(`Topic or course does not exist`);
				return;
			}

			const topicid = topicId[0].topicid;
			// console.log('🚀 ~ file: lecturemodel.ts:78 ~ topicid:', topicid);
			const courseid = courseRows[0].courseid;
			// console.log('🚀 ~ file: lecturemodel.ts:80 ~ courseid:', courseid);

			const result = await lectureModel.insertIntoLecture(
				start_date,
				end_date,
				timeofday,
				topicid,
				courseid,
				state,
			);
			const lectureid = result.insertId;
			console.log('🚀 ~ file: lecturemodel.ts:88 ~ lectureid:', lectureid);
			return lectureid;
		} catch (error) {
			console.error(error);
		}
	},
};

export default lectureController;
