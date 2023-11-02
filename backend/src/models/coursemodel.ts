import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

interface Course {
	courseid: number;
	coursename: string;
}

interface CourseModel {
	fetchAll(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findById(id: number): Promise<Course | null>;
	findByTeacherId(teacherId: number): Promise<[RowDataPacket[], FieldPacket[]]>;
}

const Course: CourseModel = {
	fetchAll() {
		return pool.promise().query<RowDataPacket[]>('SELECT * FROM courses');
	},

	async findById(id) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM courses WHERE courseid = ?', [id]);
		return (rows[0] as Course) || null;
	},

	findByTeacherId(teacherId) {
		return pool.promise().query<RowDataPacket[]>(
			`SELECT courses.* 
       FROM courses 
       JOIN courseinstructors ON courses.courseid = courseinstructors.courseid 
       WHERE courseinstructors.userid = ?`,
			[teacherId]
		);
	},
};

export default Course;
