import {FieldPacket, RowDataPacket} from 'mysql2';
import pool from '../database/db.js';

interface Class {
	classid: number;
	classname: string;
	classdescription: string;
	// other fields...
}

interface ClassModel {
	fetchAllClasses(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByClassId(id: number): Promise<Class | null>;
	insertIntoClass(classname: string, classdescription: string): Promise<void>;
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

	async insertIntoClass(classname, classdescription) {
		await pool
			.promise()
			.query('INSERT INTO class (classname, classdescription) VALUES (?, ?)', [
				classname,
				classdescription,
			]);
	},
	// other methods...
};

export default Class;
