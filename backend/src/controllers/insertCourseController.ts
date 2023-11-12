import { courseInstructorModel } from '../models/courseInstructorModel.js';
import { courseModel } from '../models/courseModel.js';
import { courseTopicModel } from '../models/courseTopicModel.js';
import { studentGroupModel } from '../models/studentGroupModel.js';
import { topicGroupModel } from '../models/topicGroupModel.js';
import { topicModel } from '../models/topicModel.js';
import { userCourseModel } from '../models/userCourseModel.js';
import { userModel } from '../models/userModel.js';


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
        const existingInstructor = await userModel.findUserByEmailAndStaff(instructoremail);

        if (!existingInstructor) {
            return Promise.reject(
                new Error('Instructor email not found or the user is not a staff member'),
            );
        }

        try {
            const instructoruserid = existingInstructor.userid;
            let studentGroupId = await studentGroupModel.findOrCreateGroup(group_name);
            const startDateString = start_date.toISOString().slice(0, 19).replace('T', ' ');
            const endDateString = end_date.toISOString().slice(0, 19).replace('T', ' ');

            const existingCourse = await courseModel.findCourseByCode(code);

            if (existingCourse) {
                throw new Error('Course already exists');
            }

            const courseId = await courseModel.insertCourse(name, startDateString, endDateString, code, studentGroupId);
            const instructorInserted = await courseInstructorModel.insertInstructor(instructoruserid, courseId);

            if (!instructorInserted) {
                throw new Error('Failed to insert instructor into courseinstructors');
            }

            if (topicgroup) {
                let topicGroupId = await topicGroupModel.findOrCreateTopicGroup(topicgroup);

                if (topics) {
                    const topicslist = JSON.parse(topics);
                    for (const topic of topicslist) {
                        let topicId = await topicModel.findOrCreateTopic(topic, topicGroupId);
                        await courseTopicModel.findOrCreateCourseTopic(courseId, topicId);
                    }
                }
            }

            for (const student of students) {
                let userId = await userModel.findOrCreateUser(student);
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
}