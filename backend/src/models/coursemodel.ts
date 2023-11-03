import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

interface Course {
	courseid: number;
	name: string;
	start_date: Date;
	created_at: Date;
	end_date: Date;
	code: string;
	studentgroupid: number | null;
	// other fields...
}

interface CourseModel {
	fetchAllCourses(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByCourseId(id: number): Promise<Course | null>;
	insertIntoCourse(
		name: string,
		start_date: Date,
		end_date: Date,
		code: string,
		studentgroupid: number | null,
	): Promise<void>;
	deleteByCourseId(id: number): Promise<void>;
	updateCourseDetails(
		id: number,
		name: string,
		start_date: Date,
		end_date: Date,
		code: string,
		studentgroupid: number | null,
	): Promise<void>;
	countCourses(): Promise<number>;
	findByCode(code: string): Promise<Course | null>;
	checkIfCourseExists(code: string): Promise<boolean>;
	// other methods...
}

const Course: CourseModel = {
	async fetchAllCourses() {
		try {
			return await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM courses');
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

	async insertIntoCourse(name, start_date, end_date, code, studentgroupid) {
		try {
			await pool
				.promise()
				.query(
					'INSERT INTO courses (name, start_date, end_date, code, studentgroupid) VALUES (?, ?, ?, ?, ?)',
					[name, start_date, end_date, code, studentgroupid],
				);
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
