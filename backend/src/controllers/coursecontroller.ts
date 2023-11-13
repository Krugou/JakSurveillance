import courseInstructorModel from '../models/courseinstructormodel.js';
import courseModel from '../models/coursemodel.js';
import courseTopicModel from '../models/coursetopicmodel.js';
import studentGroupModel from '../models/studentgroupmodel.js';
import topicGroupModel from '../models/topicgroupmodel.js';
import topicModel from '../models/topicmodel.js';
import userCourseModel from '../models/usercoursemodel.js';
import userModel from '../models/usermodel.js';

interface Student {
	email: string;
	first_name: string;
	name: string;
	last_name: string;
	studentnumber: number;
	'Arrival Group': string;
	'Admin Groups': string;
	Program: string;
	'Form of Education': string;
	Registration: string;
	Assessment: string;
}
const courseController = {
	async insertIntoCourse(
		name: string,
		start_date: Date,
		end_date: Date,
		code: string,
		group_name: string,
		students: Student[],
		instructoremail: string,
		topics?: string,
		topicgroup?: string,
	) {
		console.log('Inserting into course');

		try {
			const existingInstructor = await userModel.checkIfEmailMatchesStaff(
				instructoremail,
			);

			if (!existingInstructor) {
				return Promise.reject(
					new Error('Instructor email not found or the user is not a staff member'),
				);
			}
            const instructoruserid = existingInstructor.userid;

			try {
				let studentGroupId = await studentGroupModel.checkIfGroupNameExists(
					group_name,
				);

				if (!studentGroupId) {
					studentGroupId = await studentGroupModel.insertIntoStudentGroup(
						group_name,
					);
				}
				const startDateString = start_date
					.toISOString()
					.slice(0, 19)
					.replace('T', ' ');
				const endDateString = end_date.toISOString().slice(0, 19).replace('T', ' ');

				const existingCourse = await courseModel.findByCode(code);

				if (existingCourse) {
					throw new Error('Course already exists');
				}

				const courseId = await courseModel.insertCourse(
					name,
					startDateString,
					endDateString,
					code,
					studentGroupId,
				);
				const instructorInserted = await courseInstructorModel.insertInstructor(
					instructoruserid,
					courseId,
				);

				if (!instructorInserted) {
					throw new Error('Failed to insert instructor into courseinstructors');
				}

				if (topicgroup) {
					const topicGroupId = await topicGroupModel.findOrCreateTopicGroup(
						topicgroup,
					);

					if (topics) {
						const topicslist = JSON.parse(topics);
						for (const topic of topicslist) {
							const topicId = await topicModel.findOrCreateTopic(topic, topicGroupId);
							await courseTopicModel.findOrCreateCourseTopic(courseId, topicId);
						}
					}
				}

				for (const student of students) {
					const userId = await userModel.findOrCreateUser(student);
					await userCourseModel.insertUserCourse(userId, courseId);
				}
			} catch (error) {
				console.error(error);
				return Promise.reject(error);
			}
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default courseController;
