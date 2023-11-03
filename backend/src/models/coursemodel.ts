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
	fetchAllCourses() {
		return pool.promise().query<RowDataPacket[]>('SELECT * FROM courses');
	},

	async findByCourseId(id) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM courses WHERE courseid = ?', [id]);
		return (rows[0] as Course) || null;
	},

	async insertIntoCourse(name, start_date, end_date, code, studentgroupid) {
		await pool
			.promise()
			.query(
				'INSERT INTO courses (name, start_date, end_date, code, studentgroupid) VALUES (?, ?, ?, ?, ?)',
				[name, start_date, end_date, code, studentgroupid],
			);
	},

	async deleteByCourseId(id) {
		await pool.promise().query('DELETE FROM courses WHERE courseid = ?', [id]);
	},
	async updateCourseDetails(
		id,
		name,
		start_date,
		end_date,
		code,
		studentgroupid,
	) {
		await pool
			.promise()
			.query(
				'UPDATE courses SET name = ?, start_date = ?, end_date = ?, code = ?, studentgroupid = ? WHERE courseid = ?',
				[name, start_date, end_date, code, studentgroupid, id],
			);
	},

	async countCourses() {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM courses');
		return rows[0].count;
	},

	async findByCode(code) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM courses WHERE code = ?', [code]);
		return (rows[0] as Course) || null;
	},

	async checkIfCourseExists(code) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM courses WHERE code = ?', [code]);
		return rows.length > 0;
	},

	// other methods...
};

export default Course;
