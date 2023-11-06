import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

interface Class {
	classid: number;
	start_date: Date;
	end_date: Date;
	topicid: number;
	usercourseid: number;
	// other fields...
}

interface ClassModel {
	fetchAllClasses(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByClassId(id: number): Promise<Class | null>;
	insertIntoClass(
		start_date: Date,
		end_date: Date,
		topicname: string,
		coursecode: string,
	): Promise<void>;
	updateClassDates(id: number, start_date: Date, end_date: Date): Promise<void>;
	deleteByClassId(id: number): Promise<void>;
	countAllClasses(): Promise<number>;
	findByTopicId(topicid: number): Promise<Class[]>;
	// other methods...
}

const Class: ClassModel = {
	async fetchAllClasses() {
		try {
			return await pool.promise().query<RowDataPacket[]>('SELECT * FROM class');
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async findByClassId(id) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM class WHERE classid = ?', [id]);
			return (rows[0] as Class) || null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async insertIntoClass(
		topicname: string,
		coursecode: string,
		start_date: Date,
		end_date: Date,
	) {
		try {
			const [topicRows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT topicid FROM topics WHERE topicname = ?', [
					topicname,
				]);
			console.log('🚀 ~ file: classmodel.ts:63 ~ topicRows:', topicRows);

			const [courseRows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT courseid FROM courses WHERE code = ?', [
					coursecode,
				]);
			console.log('🚀 ~ file: classmodel.ts:70 ~ courseRows:', courseRows);

			if (topicRows.length === 0 || courseRows.length === 0) {
				console.error(`Topic or course does not exist`);
				return;
			}

			const topicid = topicRows[0].topicid;
			console.log('🚀 ~ file: classmodel.ts:78 ~ topicid:', topicid);
			const courseid = courseRows[0].courseid;
			console.log('🚀 ~ file: classmodel.ts:80 ~ courseid:', courseid);

			await pool
				.promise()
				.query(
					'INSERT INTO class (start_date, end_date, topicid, courseid) VALUES (?, ?, ?, ?)',
					[start_date, end_date, topicid, courseid],
				);
		} catch (error) {
			console.error(error);
		}
	},

	async deleteByClassId(id) {
		try {
			await pool.promise().query('DELETE FROM class WHERE classid = ?', [id]);
		} catch (error) {
			console.error(error);
		}
	},

	async countAllClasses() {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM class');
			return rows[0].count;
		} catch (error) {
			console.error(error);
		}
	},

	async findByTopicId(topicid) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM class WHERE topicid = ?', [topicid]);
			return rows as Class[];
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	// other methods...
};

export default Class;
