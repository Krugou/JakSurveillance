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
		topicid: number,
		usercourseid: number,
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

	async insertIntoClass(start_date, end_date, topicid, usercourseid) {
		try {
			await pool
				.promise()
				.query(
					'INSERT INTO class (start_date, end_date, topicid, usercourseid) VALUES (?, ?, ?, ?)',
					[start_date, end_date, topicid, usercourseid],
				);
		} catch (error) {
			console.error(error);
		}
	},

	async updateClassDates(id, start_date, end_date) {
		try {
			await pool
				.promise()
				.query(
					'UPDATE class SET start_date = ?, end_date = ? WHERE classid = ?',
					[start_date, end_date, id],
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
				.query<RowDataPacket[]>('SELECT * FROM class WHERE topicid = ?', [
					topicid,
				]);
			return rows as Class[];
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	// other methods...
};

export default Class;
