import {ResultSetHeader, RowDataPacket} from 'mysql2';
import pool from '../config/adminDBPool.js';

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
	insertCourse(
		name: string,
		startDateString: string,
		endDateString: string,
		code: string,
		studentGroupId: number,
	): Promise<ResultSetHeader>;
	// Add other methods here...
}
const course: CourseModel = {
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
	/**
	 * Inserts a new course into the database with the given parameters.
	 * @param {string} name - The name of the course.
	 * @param {Date} start_date - The start date of the course.
	 * @param {Date} end_date - The end date of the course.
	 * @param {string} code - The code of the course.
	 * @param {string} group_name - The name of the student group for the course.
	 * @param {Student[]} students - An array of Student objects representing the students in the course.
	 * @param {string} instructoremail - The email address of the instructor for the course.
	 * @param {string} [topics] - A JSON string representing an array of topic names for the course.
	 * @param {string} [topicgroup] - The name of the topic group for the course.
	 * @returns {Promise<void>} - A Promise that resolves when the course has been successfully inserted.
	 * @throws {Error} - If the instructor email is not found or the user is not a staff member, or if the course already exists.
	 */
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
			// Check if the instructor exists and is a staff member
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
				// Check if the student group exists
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
					// Insert the student group if it doesn't exist
					const [groupResult] = await pool
						.promise()
						.query<ResultSetHeader>(
							'INSERT INTO studentgroups (group_name) VALUES (?)',
							[group_name],
						);

					studentGroupId = groupResult.insertId;
				}
				// Format the dates and insert the course
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
				// Insert the instructor into the course
				const [instructorResult] = await pool
					.promise()
					.query<ResultSetHeader>(
						'INSERT INTO courseinstructors (userid, courseid) VALUES (?, ?)',
						[instructoruserid, courseId],
					);
				if (instructorResult.affectedRows === 0) {
					throw new Error('Failed to insert instructor into courseinstructors');
				}
				let topicId = 0;
				if (topicgroup) {
					try {
						// Check if the topic group exists
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
							// Insert the topic group if it doesn't exist
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

								if (existingCourseTopic.length === 0) {
									console.error(`Topic ${topic} does not exist`);
									// Insert the topic if it doesn't exist
									const [topicResult] = await pool
										.promise()
										.query<ResultSetHeader>('INSERT INTO topics (topicname) VALUES (?)', [
											topic,
										]);
									topicId = topicResult.insertId;
									// Insert the topic into the topic group
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
										// Insert the topic into the topic group if it's not already there
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
									// Insert the course-topic relation if it doesn't exist
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
				// Insert the students into the course
				for (const student of students) {
					try {
						const [existingUserByNumber] = await pool
							.promise()
							.query<RowDataPacket[]>('SELECT * FROM users WHERE studentnumber = ?', [
								student.studentnumber,
							]);

						let userId: number = 0;
						let usercourseid: number = 0;
						if (existingUserByNumber.length > 0) {
							// console.error('User with this student number already exists');
							// If the user already exists, insert them into the course
							userId = existingUserByNumber[0].userid;
							const [result] = await pool
								.promise()
								.query('INSERT INTO usercourses (userid, courseid) VALUES (?, ?)', [
									userId,
									courseId,
								]);

							usercourseid = (result as ResultSetHeader).insertId;
						} else {
							const [existingUserByEmail] = await pool
								.promise()
								.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [
									student.email,
								]);

							if (existingUserByEmail.length > 0) {
								// If the user exists with a different student number, update their student number and insert them into the course
								await pool
									.promise()
									.query('UPDATE users SET studentnumber = ? WHERE email = ?', [
										student.studentnumber,
										student.email,
									]);
								userId = existingUserByEmail[0].userid;
								const [result] = await pool
									.promise()
									.query('INSERT INTO usercourses (userid, courseid) VALUES (?, ?)', [
										userId,
										courseId,
									]);

								usercourseid = (result as ResultSetHeader).insertId;
							} else {
								// Insert the user if they don't exist
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
						// Insert the user into the course
						const [result] = await pool
							.promise()
							.query('INSERT INTO usercourses (userid, courseid) VALUES (?, ?)', [
								userId,
								courseId,
							]);

						usercourseid = (result as ResultSetHeader).insertId;
						try {
							await pool
								.promise()
								.query(
									'INSERT INTO usercourse_topics (usercourseid, topicid) VALUES (?, ?)',
									[usercourseid, topicId],
								);

							console.log('Data inserted successfully');
						} catch (error) {
							console.error(error);
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

	async findCourseIdUsingCourseCode(coursecode) {
		const [courseResult] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT courseid FROM courses WHERE code = ?', [
				coursecode,
			]);
		return courseResult;
	},
	async getCoursesByCourseId(courseId) {
		try {
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

	async insertCourse(
		name: string,
		startDateString: string,
		endDateString: string,
		code: string,
		studentGroupId: number,
	) {
		const [courseResult] = await pool
			.promise()
			.query<ResultSetHeader>(
				'INSERT INTO courses (name, start_date, end_date, code, studentgroupid) VALUES (?, ?, ?, ?, ?)',
				[name, startDateString, endDateString, code, studentGroupId],
			);

		return courseResult;
	},
	// other methods...

	async getStudentsCourses(email: string) {
		try {
			const [rows] = await pool.promise().query<RowDataPacket[]>(
				`SELECT 
				u.email,
				c.courseid,
				c.name AS course_name,
				c.start_date AS startDate,
				c.end_date AS endDate,
				c.code AS code,
				sg.group_name AS student_group,
				usercourseid,
				GROUP_CONCAT(DISTINCT t.topicname) AS topic_names,
				GROUP_CONCAT(DISTINCT u2.email) AS instructor_name
		FROM 
				users u
		JOIN 
				usercourses uc ON u.userid = uc.userid
		JOIN 
				courses c ON uc.courseid = c.courseid
		LEFT JOIN 
				studentgroups sg ON c.studentgroupid = sg.studentgroupid
		LEFT JOIN 
				coursetopics ct ON c.courseid = ct.courseid
		LEFT JOIN 
				topics t ON ct.topicid = t.topicid
		LEFT JOIN 
				courseinstructors ci ON c.courseid = ci.courseid
		LEFT JOIN 
				users u2 ON ci.userid = u2.userid
		WHERE 
				u.email = ?
		GROUP BY 
				c.start_date;`,
				[email],
			);
			console.log(rows);
			return rows as Course[];
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default course;
