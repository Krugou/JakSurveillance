import {FieldPacket, ResultSetHeader, RowDataPacket} from 'mysql2';
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
	countCourses: () => Promise<number>;
	findByCode: (code: string) => Promise<Course | null>;
	checkIfCourseExists: (code: string) => Promise<boolean>;
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
				.query<RowDataPacket[]>('SELECT * FROM courses WHERE courseid = ?', [
					id,
				]);
			return (rows[0] as Course) || null;
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
	) {
		console.log('Inserting into course');

		try {
			const [existingGroup] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT * FROM studentgroups WHERE group_name = ?',
					[group_name],
				);

			if (existingGroup.length > 0) {
				throw new Error('Group already exists');
			}

			const [groupResult] = await pool
				.promise()
				.query<ResultSetHeader>(
					'INSERT INTO studentgroups (group_name) VALUES (?)',
					[group_name],
				);

			const studentGroupId = groupResult.insertId;
			// Convert start_date and end_date to strings in the format 'YYYY-MM-DD HH:mm:ss'
			const startDateString = start_date
				.toISOString()
				.slice(0, 19)
				.replace('T', ' ');
			const endDateString = end_date
				.toISOString()
				.slice(0, 19)
				.replace('T', ' ');
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

			for (const student of students) {
				const [existingUser] = await pool
					.promise()
					.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [
						student.email,
					]);
				if (existingUser.length === 0) {
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

					const userId = userResult.insertId;

					await pool
						.promise()
						.query('INSERT INTO usercourses (userid, courseid) VALUES (?, ?)', [
							userId,
							courseId,
						]);
				} else {
					return Promise.reject('User already exists');
				}
			}

			return Promise.resolve();
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async deleteByCourseId(id) {
		try {
			await pool
				.promise()
				.query('DELETE FROM courses WHERE courseid = ?', [id]);
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

	// other methods...
};

export default Course;
