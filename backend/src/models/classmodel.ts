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
	fetchAllClasses() {
		return pool.promise().query<RowDataPacket[]>('SELECT * FROM class');
	},

	async findByClassId(id) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM class WHERE classid = ?', [id]);
		return (rows[0] as Class) || null;
	},

	async insertIntoClass(start_date, end_date, topicid, usercourseid) {
		await pool
			.promise()
			.query(
				'INSERT INTO class (start_date, end_date, topicid, usercourseid) VALUES (?, ?, ?, ?)',
				[start_date, end_date, topicid, usercourseid],
			);
	},
	async updateClassDates(id, start_date, end_date) {
		await pool
			.promise()
			.query(
				'UPDATE class SET start_date = ?, end_date = ? WHERE classid = ?',
				[start_date, end_date, id],
			);
	},

	async deleteByClassId(id) {
		await pool.promise().query('DELETE FROM class WHERE classid = ?', [id]);
	},

	async countAllClasses() {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM class');
		return rows[0].count;
	},

	async findByTopicId(topicid) {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM class WHERE topicid = ?', [
				topicid,
			]);
		return rows as Class[];
	},
	// other methods...
};

export default Class;
