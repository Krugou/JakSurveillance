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
	findCourseIdUsingCourseCode(coursecode: string): Promise<RowDataPacket[]>;
	getStudentsCourses(email: string): unknown;
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

	async findByCode(code: string): Promise<boolean> {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM courses WHERE code = ?', [code]);
			return Boolean(rows[0]);
		} catch (error) {
			console.error(error);
			throw new Error('Database query failed');
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
            GROUP_CONCAT(DISTINCT topics.topicname) AS topic_names,
            (SELECT COUNT(DISTINCT userid) FROM usercourses WHERE courseid = ?) AS user_count,
            GROUP_CONCAT(DISTINCT u2.email) AS instructor_name FROM courses
            JOIN studentgroups ON courses.studentgroupid = studentgroups.studentgroupid
            LEFT JOIN courseinstructors ci ON courses.courseid = ci.courseid
            LEFT JOIN users u2 ON ci.userid = u2.userid
            LEFT JOIN coursetopics ON courses.courseid = coursetopics.courseid
            LEFT JOIN topics ON coursetopics.topicid = topics.topicid
            LEFT JOIN usercourses ON courses.courseid = usercourses.courseid
            WHERE courses.courseid = ?
            GROUP BY courses.courseid;`,
				[courseId, courseId],
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
				uc.usercourseid,
			 GROUP_CONCAT(DISTINCT t_selected.topicname) AS selected_topics,
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
				usercourse_topics ut ON uc.usercourseid = ut.usercourseid
		LEFT JOIN 
				courseinstructors ci ON c.courseid = ci.courseid
		LEFT JOIN 
				users u2 ON ci.userid = u2.userid
		LEFT JOIN
				topics t_selected ON ut.topicid = t_selected.topicid
		WHERE 
				u.email = ?
		GROUP BY 
				c.courseid;`,
				[email],
			);
			return rows as Course[];
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async deleteCourse(courseId: number): Promise<string> {
		try {
			// Disable foreign key checks

			// Delete the course
			const [result] = await pool
				.promise()
				.query('DELETE FROM courses WHERE courseid = ?', [courseId]);

			// Enable foreign key checks again

			// Return a success message
			return result.affectedRows > 0;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	checkIfCourseExists: function (code: string): Promise<boolean> {
		throw new Error('Function not implemented.');
	},

	// Function for updating course info
	async updateCourseInfo(
		courseid: number,
		name: string,
		start_date: Date,
		end_date: Date,
		code: string,
		studentgroupname: string,
		instructors: string[],
		topic_names: string[],
	): Promise<void> {
		let studentgroupid: string | undefined = '';
		const connection = await pool.promise().getConnection();
		await connection.beginTransaction();

		try {
			// Get the topic group id if the topic group name is provided
			if (topic_names.length > 0) {
				// Delete all topics from the course
				await connection.query(`DELETE FROM coursetopics WHERE courseid = ?`, [
					courseid,
				]);

				// Insert the new topics into database if they don't exist
				for (const topic of topic_names) {
					const [rows] = await connection.query<RowDataPacket[]>(
						`SELECT * FROM topics WHERE topicname = ?`,
						[topic],
					);
					if (rows.length === 0) {
						await connection.query(`INSERT INTO topics (topicname) VALUES (?)`, [
							topic,
						]);
					}

					// Select the topicid for each topic name
					const [rows2] = await connection.query<RowDataPacket[]>(
						`SELECT topicid FROM topics WHERE topicname = ?`,
						[topic],
					);
					const topicid = rows2[0].topicid;

					// Insert the new topics into the course
					await connection.query(
						`INSERT INTO coursetopics (courseid, topicid) VALUES (?, ?)`,
						[courseid, topicid],
					);
				}
			}

			if (instructors) {
				// Delete all instructors from the course
				await connection.query(`DELETE FROM courseinstructors WHERE courseid = ?`, [
					courseid,
				]);

				// Insert the new instructors into the course
				for (const instructor of instructors) {
					const [rows] = await connection.query<RowDataPacket[]>(
						`SELECT userid FROM users WHERE email = ? AND staff = 1`,
						[instructor],
					);
					if (rows.length === 0) {
						throw new Error(
							`Teacher's email was not found or the user is not a member of staff`,
						);
					}
					const userid = rows[0].userid;
					await connection.query(
						`INSERT INTO courseinstructors (userid, courseid) VALUES (?, ?)`,
						[userid, courseid],
					);
				}
			}

			// Get the student group id if the student group name is provided
			if (studentgroupname) {
				const [rows] = await connection.query<RowDataPacket[]>(
					`SELECT studentgroupid FROM studentgroups WHERE group_name = ?`,
					[studentgroupname],
				);
				if (rows.length === 0) {
					throw new Error(`No student group found with name ${studentgroupname}`);
				}
				studentgroupid = rows[0].studentgroupid;
			}

			// Update the course info
			const [rows] = await connection.query<RowDataPacket[]>(
				`UPDATE courses SET name = ?, start_date = ?, end_date = ?, code = ?, studentgroupid = ? WHERE courseid = ?`,
				[name, start_date, end_date, code, studentgroupid, courseid],
			);

			await connection.commit();

			// q: if i return here, does the finally block still run?
			return rows as Course[];
		} catch (error) {
			await connection.rollback();
			console.error(error);
			return Promise.reject(error);
		} finally {
			connection.release();
		}
	},
	async getCoursesWithDetails(): Promise<Course[]> {
		try {
			const [rows]: RowDataPacket[][] = await pool.promise().query<
				RowDataPacket[]
			>(`
        SELECT 
            courses.courseid,
            courses.name,
            courses.start_date,
            courses.end_date,
            courses.code,
            studentgroups.group_name AS student_group,
            topics.topicname,
            instructors.email AS instructor_email
        FROM 
            courses
        LEFT JOIN 
            studentgroups ON courses.studentgroupid = studentgroups.studentgroupid
        LEFT JOIN 
            coursetopics ON courses.courseid = coursetopics.courseid
        LEFT JOIN 
            topics ON coursetopics.topicid = topics.topicid
        LEFT JOIN 
            courseinstructors ON courses.courseid = courseinstructors.courseid
        LEFT JOIN 
            users AS instructors ON courseinstructors.userid = instructors.userid;
    `);

			// Transform the flat data structure into a nested one
			const courses = rows.reduce((acc, row) => {
				const courseIndex = acc.findIndex(
					course => course.courseid === row.courseid,
				);

				if (courseIndex === -1) {
					acc.push({
						courseid: row.courseid,
						name: row.name,
						start_date: row.start_date,
						end_date: row.end_date,
						code: row.code,
						student_group: row.student_group,
						topics: [row.topicname],
						instructors: [row.instructor_email],
					});
				} else {
					acc[courseIndex].topics.push(row.topicname);
					if (!acc[courseIndex].instructors.includes(row.instructor_email)) {
						acc[courseIndex].instructors.push(row.instructor_email);
					}
				}

				return acc;
			}, []);

			return courses;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async getAllStudentsOnCourse(courseId: number): Promise<RowDataPacket[]> {
		try {
			const [rows]: RowDataPacket[][] = await pool
				.promise()
				.query<RowDataPacket[]>(
					`SELECT 
								users.email,
								users.first_name,
								users.last_name,
								users.studentnumber,
								usercourses.usercourseid,
								users.userid
						FROM 
								users
						JOIN
								usercourses ON users.userid = usercourses.userid
						JOIN
								courses ON usercourses.courseid = courses.courseid
						WHERE
								courses.courseid = ?;`,
					[courseId],
				);

			return rows;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
};

export default course;
