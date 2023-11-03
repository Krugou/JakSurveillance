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
	// other methods...
};

export default Course;
