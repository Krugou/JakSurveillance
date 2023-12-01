import attendanceModel from '../models/attendancemodel.js';
import courseInstructorModel from '../models/courseinstructormodel.js';
import course from '../models/coursemodel.js';
import courseModel from '../models/coursemodel.js';
import courseTopicModel from '../models/coursetopicmodel.js';
import studentGroupModel from '../models/studentgroupmodel.js';
import topicGroupModel from '../models/topicgroupmodel.js';
import topicinGroupModel from '../models/topicingroupmodel.js';
import topicModel from '../models/topicmodel.js';
import usercourse_topicsModel from '../models/usercourse_topicsmodel.js';
import userCourseModel from '../models/usercoursemodel.js';
import userModel from '../models/usermodel.js';
import attendanceModel from '../models/attendancemodel.js';
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
interface Instructor {
	email: string;
}
const courseController = {
	async insertIntoCourse(
		name: string,
		start_date: Date,
		end_date: Date,
		code: string,
		group_name: string,
		students: Student[],
		instructors: Instructor[],
		topics?: string,
		topicgroup?: string,
	) {
		console.log('🚀 ~ file: coursecontroller.ts:37 ~ topics:', topics);
		console.log('🚀 ~ file: coursecontroller.ts:37 ~ topicgroup:', topicgroup);
		let courseId = 0;
		try {
			const instructorUserIds: number[] = [];
			for (const instructor of instructors) {
				const existingInstructor = await userModel.checkIfEmailMatchesStaff(
					instructor.email,
				);
				if (!existingInstructor) {
					return Promise.reject(
						new Error('Instructor email not found or the user is not a staff member'),
					);
				}
				const instructorUserId = existingInstructor[0].userid;
				instructorUserIds.push(instructorUserId);
			}
			const existingCourse = await courseModel.findByCode(code);

			if (existingCourse) {
				return Promise.reject(new Error('Course with this code already exists'));
			}
			try {
				const existingStudentGroup = await studentGroupModel.checkIfGroupNameExists(
					group_name,
				);

				let studentGroupId = 0;
				if (existingStudentGroup && existingStudentGroup.length > 0) {
					console.error('Group already exists');
					studentGroupId = existingStudentGroup[0].studentgroupid;
				} else {
					const newStudentGroup = await studentGroupModel.insertIntoStudentGroup(
						group_name,
					);

					studentGroupId = newStudentGroup.insertId;
				}
				const startDateString = new Date(start_date)
					.toISOString()
					.slice(0, 19)
					.replace('T', ' ');
				const endDateString = new Date(end_date)
					.toISOString()
					.slice(0, 19)
					.replace('T', ' ');

				const courseResult = await courseModel.insertCourse(
					name,
					startDateString,
					endDateString,
					code,
					studentGroupId,
				);
				courseId = courseResult.insertId;
				for (const instructorUserId of instructorUserIds) {
					const instructorInserted =
						await courseInstructorModel.insertCourseInstructor(
							instructorUserId,
							courseId,
						);

					if (!instructorInserted) {
						return Promise.reject(
							new Error('Instructor could not be inserted into the course'),
						);
					}
				}
				let topicGroupId = 0;
				let topicId = 0;
				if (topicgroup) {
					try {
						const newTopicGroup = await topicGroupModel.insertTopicGroup(
							topicgroup,
							instructorUserIds[0],
						);

						topicGroupId = newTopicGroup.insertId;

						if (topics) {
							const topicslist = JSON.parse(topics);
							for (const topic of topicslist) {
								const ExistingTopic = await topicModel.checkIfTopicExists(topic);

								if (ExistingTopic.length > 0) {
									console.error('Topic already exists');
									topicId = ExistingTopic[0].topicid;
								} else {
									const newTopic = await topicModel.insertTopic(topic);
									topicId = newTopic.insertId;
								}

								const topicGroupTopicRelationExists =
									await topicinGroupModel.checkIfTopicInGroupExists(
										topicGroupId,
										topicId,
									);

								if (topicGroupTopicRelationExists.length > 0) {
									console.error('Topic group relation exists');
								} else {
									await topicinGroupModel.insertTopicInGroup(topicGroupId, topicId);
								}

								const relationExists =
									await courseTopicModel.checkIfCourseTopicRelationExists(
										courseId,
										topicId,
									);

								if (relationExists.length < 0) {
									console.error('Course topic group relation exists');
								} else {
									await courseTopicModel.insertCourseTopic(courseId, topicId);
								}
							}
						}
					} catch (error) {
						console.error(error);
					}
				}

				for (const student of students) {
					try {
						const existingUserByNumber =
							await userModel.checkIfUserExistsByStudentNumber(student.studentnumber);

						let userId: number = 0;
						let usercourseid: number = 0;
						if (existingUserByNumber.length > 0) {
							console.error('User with this student number already exists');
							// If the user already exists, insert them into the course
							userId = existingUserByNumber[0].userid;
							const result = await userCourseModel.insertUserCourse(userId, courseId);

							usercourseid = (result as ResultSetHeader).insertId;
						} else {
							const existingUserByEmail = await userModel.checkIfUserExistsByEmail(
								student.email,
							);

							if (existingUserByEmail.length > 0) {
								// If the user exists with a different student number, update their student number and insert them into the course
								await userModel.updateUserStudentNumber(
									student.studentnumber,
									student.email,
								);
								userId = existingUserByEmail[0].userid;
								const [result] = await userCourseModel.insertUserCourse(
									userId,
									courseId,
								);

								usercourseid = (result as ResultSetHeader).insertId;
							} else {
								// Insert the user if they don't exist
								const userResult = await userModel.insertStudentUser(
									student.email,
									student.first_name,
									student.last_name,
									student.studentnumber,
									studentGroupId,
								);

								userId = userResult.insertId;
							}
						}
						// Insert the user into the course

						const existingUserCourse = await userCourseModel.checkIfUserCourseExists(
							userId,
							courseId,
						);

						if (existingUserCourse.length === 0) {
							// Insert the user into the course
							await userCourseModel.insertUserCourse(userId, courseId);
						} else {
							console.error('User is already enrolled in this course');
						}
						/*
						try {
							await usercourse_topicsModel.insertUserCourseTopic(
								usercourseid,
								topicId,
							);

							console.log('Data inserted successfully', userId);
						} catch (error) {
							console.error(error);
						}
						*/
					} catch (error) {
						console.error(error);
					}
				}
			} catch (error) {
				console.error(error);
				return Promise.reject(error);
			}
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
		return courseId;
	},
	getDetailsByCourseId: async (courseId: string) => {
		try {
			let usersOnCourse = await attendanceModel.getAttendaceByCourseId(courseId);

			// Assuming usersOnCourse is an array of objects
			const distinctUserCourseIds = [
				...new Set(usersOnCourse.map(user => user.usercourseid)),
			];

			for (const usercourseid of distinctUserCourseIds) {
				console.log(usercourseid, 'is a distinct usercourseid');
				const selectedParts =
					await usercourse_topicsModel.findUserCourseTopicByUserCourseId(
						usercourseid,
					);
				console.log(selectedParts);

				// Add userCourseTopic to each usersOnCourse object with the same usercourseid
				usersOnCourse = usersOnCourse.map(user => {
					if (user.usercourseid === usercourseid) {
						return {...user, selectedParts};
					} else {
						return user;
					}
				});
			}

			const lectureCount = await attendanceModel.getLectureCountByTopic(courseId);
			return {users: [...usersOnCourse], lectures: [...lectureCount]};
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};

export default courseController;
