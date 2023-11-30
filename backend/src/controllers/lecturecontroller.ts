import {match} from 'assert';
import course from '../models/coursemodel.js';
import lectureModel from '../models/lecturemodel.js';
import topicModel from '../models/topicmodel.js';
import usercourse_topicsModel from '../models/usercourse_topicsmodel.js';

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
	async getStudentsInLecture(lectureid: number) {
		try {
			const allStudentsInLecture = await lectureModel.getStudentsByLectureId(
				lectureid,
			);
			for (let i = 0; i < allStudentsInLecture.length; i++) {
				const student = allStudentsInLecture[i];
				const usercourseid = student.usercourseid;
				const usercourseTopicIds =
					await usercourse_topicsModel.findUserCourseTopicByUserCourseId(
						usercourseid,
					);
				console.log(usercourseTopicIds, 'JEP JEP');
				console.log(allStudentsInLecture);

				if (usercourseTopicIds.length > 0) {
					const topicIds = usercourseTopicIds.map(topic => topic.topicid);
					console.log(topicIds, 'topicIds');
					let matchedStudents = false;

					for (const topicId of topicIds) {
						if (topicId === student.topicid) {
							matchedStudents = true;
							break;
						}
					}

					if (!matchedStudents) {
						allStudentsInLecture.splice(i, 1);
						i--; // Decrement i because the array length has changed
					}
				}
			}

			return allStudentsInLecture;
		} catch (error) {
			console.error(error);
		}
	},
};

export default lectureController;
