import {ResultSetHeader, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

interface Course {
	// Define the properties of a Course here
	// For example:
	courseid?: number;
	name: string;
	start_date: Date;
	end_date: Date;
	code: string;
	studentgroupid: number;
	instructoremail: string;
}

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

interface CourseModel {
	fetchAllCourses: () => Promise<RowDataPacket[]>;
	findByCourseId: (id: number) => Promise<Course | null>;
	insertIntoCourse: (
		name: string,
		start_date: Date,
		end_date: Date,
		code: string,
		group_name: string,
		students: Student[],
		instructoremail: string,
		topics?: string,
		topicgroup?: string,
	) => Promise<void>;
	deleteByCourseId: (id: number) => Promise<void>;
	updateCourseDetails: (
		id: number,
		name: string,
		start_date: Date,
		end_date: Date,
		code: string,
		studentgroupid: number,
	) => Promise<void>;
	findByCode: (code: string) => Promise<Course | null>;
	checkIfCourseExists: (code: string) => Promise<boolean>;
	getCoursesByInstructorEmail(email: string): Promise<Course[]>;
	countCourses(): Promise<number>;
	getCoursesByCourseId(courseId: number): Promise<Course[]>;
	// Add other methods here...
}
const Course: CourseModel = {
	async fetchAllCourses() {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM courses');
			return rows;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async findByCourseId(id) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM courses WHERE courseid = ?', [id]);
			return (rows[0] as Course) || null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async getCoursesByInstructorEmail(email) {
		try {
			const [rows] = await pool.promise().query<RowDataPacket[]>(
				`SELECT courses.*, studentgroups.group_name AS studentgroup_name, 
              GROUP_CONCAT(topics.topicname) AS topic_names
          FROM courses
          JOIN courseinstructors ON courses.courseid = courseinstructors.courseid
          JOIN users ON courseinstructors.userid = users.userid
          LEFT JOIN studentgroups ON courses.studentgroupid = studentgroups.studentgroupid
          LEFT JOIN coursetopics ON courses.courseid = coursetopics.courseid
          LEFT JOIN topics ON coursetopics.topicid = topics.topicid
          WHERE users.email = ?
          GROUP BY courses.courseid`,
				[email],
			);

			return rows as Course[];
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
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
		// console.log(instructoremail);

		try {
			const [existingInstructor] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT * FROM users WHERE email = ? AND staff = 1',
					[instructoremail],
				);

			if (existingInstructor.length === 0) {
				return Promise.reject(
					new Error('Instructor email not found or the user is not a staff member'),
				);
			}

			try {
				const instructoruserid = existingInstructor[0].userid;
				const [existingGroup] = await pool
					.promise()
					.query<RowDataPacket[]>(
						'SELECT * FROM studentgroups WHERE group_name = ?',
						[group_name],
					);
				let studentGroupId = 0;
				if (existingGroup.length > 0) {
					console.error('Group already exists');
					studentGroupId = existingGroup[0].studentgroupid;
				} else {
					const [groupResult] = await pool
						.promise()
						.query<ResultSetHeader>(
							'INSERT INTO studentgroups (group_name) VALUES (?)',
							[group_name],
						);

					studentGroupId = groupResult.insertId;
				}
				const startDateString = start_date
					.toISOString()
					.slice(0, 19)
					.replace('T', ' ');
				const endDateString = end_date.toISOString().slice(0, 19).replace('T', ' ');
				const [existingCourse] = await pool
					.promise()
					.query<RowDataPacket[]>('SELECT * FROM courses WHERE code = ?', [code]);

				if (existingCourse.length > 0) {
					throw new Error('Course already exists');
				}

				const [courseResult] = await pool
					.promise()
					.query<ResultSetHeader>(
						'INSERT INTO courses (name, start_date, end_date, code, studentgroupid) VALUES (?, ?, ?, ?, ?)',
						[name, startDateString, endDateString, code, studentGroupId],
					);

				const courseId = courseResult.insertId;
				const [instructorResult] = await pool
					.promise()
					.query<ResultSetHeader>(
						'INSERT INTO courseinstructors (userid, courseid) VALUES (?, ?)',
						[instructoruserid, courseId],
					);
				if (instructorResult.affectedRows === 0) {
					throw new Error('Failed to insert instructor into courseinstructors');
				}

				for (const student of students) {
					try {
						const [existingUserByNumber] = await pool
							.promise()
							.query<RowDataPacket[]>('SELECT * FROM users WHERE studentnumber = ?', [
								student.studentnumber,
							]);

						let userId: number = 0;

						if (existingUserByNumber.length > 0) {
							// console.error('User with this student number already exists');
							userId = existingUserByNumber[0].userid;
							await pool
								.promise()
								.query('INSERT INTO usercourses (userid, courseid) VALUES (?, ?)', [
									userId,
									courseId,
								]);
						} else {
							const [existingUserByEmail] = await pool
								.promise()
								.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [
									student.email,
								]);

							if (existingUserByEmail.length > 0) {
								await pool
									.promise()
									.query('UPDATE users SET studentnumber = ? WHERE email = ?', [
										student.studentnumber,
										student.email,
									]);
								userId = existingUserByEmail[0].userid;
								await pool
									.promise()
									.query('INSERT INTO usercourses (userid, courseid) VALUES (?, ?)', [
										userId,
										courseId,
									]);
							} else {
								const [userResult] = await pool
									.promise()
									.query<ResultSetHeader>(
										'INSERT INTO users ( email, first_name, last_name, studentnumber, studentgroupid) VALUES ( ?, ?, ?, ?, ?)',
										[
											student.email,
											student.first_name,
											student.last_name,
											student.studentnumber,
											studentGroupId,
										],
									);

								userId = userResult.insertId;
							}
						}

						await pool
							.promise()
							.query('INSERT INTO usercourses (userid, courseid) VALUES (?, ?)', [
								userId,
								courseId,
							]);
					} catch (error) {
						console.error(error);
					}
				}

				if (topicgroup) {
					try {
						const [existingTopic] = await pool
							.promise()
							.query<RowDataPacket[]>(
								'SELECT * FROM topicgroups WHERE topicgroupname = ?',
								[topicgroup],
							);

						let topicGroupId = 0;
						if (existingTopic.length > 0) {
							topicGroupId = existingTopic[0].topicgroupid;
						} else {
							const [topicResult] = await pool
								.promise()
								.query<ResultSetHeader>(
									'INSERT INTO topicgroups (topicgroupname) VALUES (?)',
									[topicgroup],
								);
							topicGroupId = topicResult.insertId;
						}
						if (topics) {
							const topicslist = JSON.parse(topics);
							for (const topic of topicslist) {
								const [existingCourseTopic] = await pool
									.promise()
									.query<RowDataPacket[]>('SELECT * FROM topics WHERE topicname = ?', [
										topic,
									]);
								let topicId = 0;
								if (existingCourseTopic.length === 0) {
									console.error(`Topic ${topic} does not exist`);
									const [topicResult] = await pool
										.promise()
										.query<ResultSetHeader>('INSERT INTO topics (topicname) VALUES (?)', [
											topic,
										]);
									topicId = topicResult.insertId;

									await pool
										.promise()
										.query(
											'INSERT INTO topicsingroup (topicgroupid, topicid) VALUES (?, ?)',
											[topicGroupId, topicId],
										);
								} else {
									// Handle the case where the topic exists
									topicId = existingCourseTopic[0].topicid;

									const [existingTopicInGroup] = await pool
										.promise()
										.query<RowDataPacket[]>(
											'SELECT * FROM topicsingroup WHERE topicgroupid = ? AND topicid = ?',
											[topicGroupId, topicId],
										);
									if (existingTopicInGroup.length === 0) {
										await pool
											.promise()
											.query(
												'INSERT INTO topicsingroup (topicgroupid, topicid) VALUES (?, ?)',
												[topicGroupId, topicId],
											);
									}
								}

								const [existingCourseTopicRelation] = await pool
									.promise()
									.query<RowDataPacket[]>(
										'SELECT * FROM coursetopics WHERE courseid = ? AND topicid = ?',
										[courseId, topicId],
									);

								if (existingCourseTopicRelation.length === 0) {
									await pool
										.promise()
										.query('INSERT INTO coursetopics (courseid, topicid) VALUES (?, ?)', [
											courseId,
											topicId,
										]);
								}
							}
						}
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
	},
	async deleteByCourseId(id) {
		try {
			await pool.promise().query('DELETE FROM courses WHERE courseid = ?', [id]);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async updateCourseDetails(
		id,
		name,
		start_date,
		end_date,
		code,
		studentgroupid,
	) {
		try {
			await pool
				.promise()
				.query(
					'UPDATE courses SET name = ?, start_date = ?, end_date = ?, code = ?, studentgroupid = ? WHERE courseid = ?',
					[name, start_date, end_date, code, studentgroupid, id],
				);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async countCourses() {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM courses');
			return rows[0].count;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async findByCode(code) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM courses WHERE code = ?', [code]);
			return (rows[0] as Course) || null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async checkIfCourseExists(code) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM courses WHERE code = ?', [code]);
			return rows.length > 0;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async getCoursesByCourseId(courseId) {
		try {
			console.log('something is happening');
			const [rows] = await pool.promise().query<RowDataPacket[]>(
				`SELECT courses.*, studentgroups.group_name AS studentgroup_name, 
              GROUP_CONCAT(topics.topicname) AS topic_names
          FROM courses
          JOIN studentgroups ON courses.studentgroupid = studentgroups.studentgroupid
          LEFT JOIN coursetopics ON courses.courseid = coursetopics.courseid
          LEFT JOIN topics ON coursetopics.topicid = topics.topicid
          WHERE courses.courseid = ?
          GROUP BY courses.courseid`,
				[courseId],
			);

			return rows as Course[];
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	// other methods...
};

export default Course;
