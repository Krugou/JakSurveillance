import course from '../models/coursemodel.js';
import lectureModel from '../models/lecturemodel.js';
import topicModel from '../models/topicmodel.js';
import usercourse_topicsModel from '../models/usercourse_topicsmodel.js';
import attendanceController from './attendancecontroller.js';

const lectureController = {
	/**
	 * Inserts a new lecture into the database.
	 *
	 * @param {string} topicname - The name of the topic.
	 * @param {string} coursecode - The code of the course.
	 * @param {Date} start_date - The start date of the lecture.
	 * @param {Date} end_date - The end date of the lecture.
	 * @param {'am' | 'pm'} timeofday - The time of day of the lecture.
	 * @param {'open' | 'closed'} state - The state of the lecture.
	 * @param {number | undefined} teacherid - The ID of the teacher.
	 * @returns {Promise<number | undefined>} The ID of the inserted lecture, or undefined if the insertion failed.
	 */
	async insertIntoLecture(
		topicname: string,
		coursecode: string,
		start_date: Date,
		end_date: Date,
		timeofday: 'am' | 'pm',
		state: 'open' | 'closed',
		teacherid: number | undefined,
	) {
		try {
			const topicId = await topicModel.findTopicIdUsingTopicName(topicname);
			// console.log('🚀 ~ file: lecturemodel.ts:63 ~ topicRows:', topicId);

			const courseRows = await course.findCourseIdUsingCourseCode(coursecode);
			// console.log('🚀 ~ file: lecturemodel.ts:70 ~ courseRows:', courseRows);

			if (
				!topicId ||
				topicId.length === 0 ||
				!courseRows ||
				courseRows.length === 0
			) {
				console.error(`Topic or course does not exist`);
				return;
			}

			const topicid = topicId[0].topicid;
			// console.log('🚀 ~ file: lecturemodel.ts:78 ~ topicid:', topicid);
			const courseid = courseRows[0].courseid;
			// console.log('🚀 ~ file: lecturemodel.ts:80 ~ courseid:', courseid);

			const openLectures = await lectureModel.findOpenLecturesBycourseid(courseid);

			const result = await lectureModel.insertIntoLecture(
				start_date,
				end_date,
				timeofday,
				topicid,
				courseid,
				state,
				teacherid,
			);
			if (!result) {
				console.error('Failed to insert into lecture');
				return;
			}

			const lectureid = (result as {insertId: number}).insertId;
			console.log('🚀 ~ file: lecturemodel.ts:88 ~ lectureid:', lectureid);
			return {lectureid: lectureid, openLectures};
		} catch (error) {
			console.error(error);
		}
	},
	/**
	 * Gets the students in a lecture.
	 *
	 * @param {number} lectureid - The ID of the lecture.
	 * @returns {Promise<any[]>} An array of students in the lecture.
	 */
	async getStudentsInLecture(lectureid: number) {
		try {
			// Fetch all students in the lecture with the given ID
			const allStudentsInLecture = await lectureModel.getStudentsByLectureId(
				lectureid,
			);

			// Iterate over each student
			const filteredStudents = await Promise.all(
				allStudentsInLecture.map(async student => {
					const usercourseid = student.usercourseid;

					// Fetch the modified topics associated with the student's course if there are any
					const usercourseTopicIds =
						await usercourse_topicsModel.findUserCourseTopicByUserCourseId(
							usercourseid,
						);

					// If the student is enrolled in any modified topics
					if (usercourseTopicIds.length > 0) {
						// Map the topics to their IDs
						const topicIds = usercourseTopicIds.map(topic => topic.topicid);

						// If the student's topics were modified and they don't contain the current topic's id then remove them from the list of students
						if (!topicIds.includes(student.topicid)) {
							return null;
						}
					}

					return student;
				}),
			);

			// Remove null values from the array
			const finalStudents = filteredStudents.filter(student => student !== null);
			// Return the updated list of students
			return finalStudents;
		} catch (error) {
			console.error(error);
		}
	},

	/**
	 * Closes a lecture.
	 * @param {string} lectureid - The ID of the lecture to close.
	 * @returns {Promise<any>} A promise that resolves to the result of the lecture closing operation.
	 */
	async closeLecture(lectureid: string) {
		try {
			const students = await this.getStudentsInLecture(Number(lectureid));

			const lecture = await lectureModel.getLectureByLectureId(Number(lectureid));
			console.log(
				'🚀 ~ file: lecturecontroller.ts:126 ~ closeLecture ~ lecture:',
				lecture,
			);
			const lectureDate = lecture?.[0].start_date;
			console.log('Students:', students);
			students?.forEach(async student => {
				try {
					await attendanceController.insertIntoAttendance(
						'0',
						lectureDate,
						student?.studentnumber,
						lectureid,
					);
				} catch (error) {
					console.error(error);
				}
			});

			const result = await lectureModel.updateLectureState(lectureid, 'closed');
			console.log('Update result:', result);
			return result;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default lectureController;
