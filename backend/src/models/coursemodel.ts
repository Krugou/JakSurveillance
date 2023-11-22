import {ResultSetHeader, RowDataPacket} from 'mysql2';
import pool from '../config/adminDBPool.js';

interface Course {
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
				c.start_date;`,
				[email],
			);
			//console.log(rows);

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
};

export default course;
