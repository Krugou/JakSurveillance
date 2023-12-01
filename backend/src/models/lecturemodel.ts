import {
	FieldPacket,
	OkPacket,
	ProcedureCallPacket,
	ResultSetHeader,
	RowDataPacket,
} from 'mysql2';
import pool from '../config/adminDBPool.js';
interface Lecture {
	lectureid: number;
	start_date: Date;
	end_date: Date;
	topicid: number;
	courseid: number;
}

interface LectureModel {
	fetchAllLecturees(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByLectureId(id: number): Promise<Lecture | null>;
	insertIntoLecture(
		start_date: Date,
		end_date: Date,
		topicname: string,
		coursecode: string,
		timeofday: 'am' | 'pm',
		state: 'open' | 'closed',
	): Promise<void>;
	updateLectureDates(
		id: number,
		start_date: Date,
		end_date: Date,
	): Promise<void>;
	deleteByLectureId(id: number): Promise<void>;
	countAllLecturees(): Promise<number>;
	findByTopicId(topicid: number): Promise<Lecture[]>;
	insertIntoLecture(
		start_date: Date,
		end_date: Date,
		topicname: string,
		coursecode: string,
		timeofday: 'am' | 'pm',
	): Promise<
		| OkPacket
		| RowDataPacket[]
		| ResultSetHeader[]
		| RowDataPacket[][]
		| OkPacket[]
		| ProcedureCallPacket
	>;
	getLectureWithCourseAndTopic(lectureid: number): Promise<any>;
	// other methods...
}

const lectureModel: LectureModel = {
	async fetchAllLecturees() {
		try {
			return await pool.promise().query<RowDataPacket[]>('SELECT * FROM lecture');
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async findByLectureIdAndGetAllUserInLinkedCourse(lectureid: number) {
		try {
			const [lectureRows] = await pool
				.promise()
				.query('SELECT * FROM lecture WHERE lectureid = ?', [lectureid]);
			const lectureData = lectureRows[0];
			if (!lectureData) {
				return Promise.reject(`Lecture with lectureid ${lectureid} not found`);
			}

			const [courseRows] = await pool
				.promise()
				.query('SELECT * FROM courses WHERE courseid = ?', [lectureData.courseid]);
			const courseData = courseRows[0];
			if (!courseData) {
				return Promise.reject(
					`Course with courseid ${lectureData.courseid} not found`,
				);
			}

			const [userRows] = await pool
				.promise()
				.query(
					'SELECT u.* FROM users u JOIN usercourses uc ON u.userid = uc.userid WHERE uc.courseid = ?',
					[courseData.courseid],
				);
			return userRows;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async getStudentsByLectureId(lectureid: number) {
		try {
			const [userRows] = await pool.promise().query<RowDataPacket[]>(
				`SELECT u.*, c.topicid, uc.usercourseid FROM users u  
				JOIN usercourses uc ON u.userid = uc.userid 
				JOIN lecture c ON uc.courseid = c.courseid 
				WHERE c.lectureid = ? AND u.roleid = 1;`, // Assuming roleid 1 is for students
				[lectureid],
			);
			const uniqueUserRows = userRows.reduce((unique, o) => {
				if (!unique.some(obj => obj.userid === o.userid)) {
					unique.push(o);
				}
				return unique;
			}, []);

			return uniqueUserRows ?? [];
		} catch (error) {
			console.error(error);
			return [];
		}
	},

	// async insertIntoLecture(
	// 	topicname: string,
	// 	coursecode: string,
	// 	start_date: Date,
	// 	end_date: Date,
	// 	timeofday: 'am' | 'pm',
	// ) {
	// 	try {
	// 		const [topicRows] = await pool
	// 			.promise()
	// 			.query<RowDataPacket[]>('SELECT topicid FROM topics WHERE topicname = ?', [
	// 				topicname,
	// 			]);
	// 		console.log('🚀 ~ file: lecturemodel.ts:63 ~ topicRows:', topicRows);

	// 		const [courseRows] = await pool
	// 			.promise()
	// 			.query<RowDataPacket[]>('SELECT courseid FROM courses WHERE code = ?', [
	// 				coursecode,
	// 			]);
	// 		console.log('🚀 ~ file: lecturemodel.ts:70 ~ courseRows:', courseRows);

	// 		if (topicRows.length === 0 || courseRows.length === 0) {
	// 			console.error(`Topic or course does not exist`);
	// 			return;
	// 		}

	// 		const topicid = topicRows[0].topicid;
	// 		console.log('🚀 ~ file: lecturemodel.ts:78 ~ topicid:', topicid);
	// 		const courseid = courseRows[0].courseid;
	// 		console.log('🚀 ~ file: lecturemodel.ts:80 ~ courseid:', courseid);

	// 		const [result] = await pool
	// 			.promise()
	// 			.query(
	// 				'INSERT INTO lecture (start_date, end_date, timeofday, topicid, courseid) VALUES (?, ?, ?, ?, ?)',
	// 				[start_date, end_date, timeofday, topicid, courseid],
	// 			);
	// 		const lectureid = result.insertId;
	// 		console.log('🚀 ~ file: lecturemodel.ts:88 ~ lectureid:', lectureid);
	// 		return lectureid;
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// },

	async deleteByLectureId(id) {
		try {
			await pool.promise().query('DELETE FROM lecture WHERE lectureid = ?', [id]);
		} catch (error) {
			console.error(error);
		}
	},

	async countAllLecturees() {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM lecture');
			return rows[0].count;
		} catch (error) {
			console.error(error);
		}
	},

	async findByTopicId(topicid) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM lecture WHERE topicid = ?', [
					topicid,
				]);
			return rows as Lecture[];
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async insertIntoLecture(
		start_date,
		end_date,
		timeofday,
		topicid,
		courseid,
		state,
	) {
		const [result] = await pool
			.promise()
			.query(
				'INSERT INTO lecture (start_date, end_date, timeofday, topicid, courseid, state) VALUES (?, ?, ?, ?, ?, ?)',
				[start_date, end_date, timeofday, topicid, courseid, state],
			);
		return result;
	},
	async getLectureWithCourseAndTopic(lectureid: number) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT l.*, c.*, t.* FROM lecture l ' +
						'JOIN courses c ON l.courseid = c.courseid ' +
						'JOIN topics t ON l.topicid = t.topicid ' +
						'WHERE l.lectureid = ?',
					[lectureid],
				);

			return rows[0] ?? null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async updateLectureState(lectureid: number, state: string) {
		try {
			const [result] = await pool
				.promise()
				.query('UPDATE lecture SET state = ? WHERE lectureid = ?', [
					state,
					lectureid,
				]);

			return result;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async getLecturesByCourseId(courseid: number) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT * FROM lecture ' +
						'JOIN courses ON lecture.courseid = courses.courseid ' +
						'WHERE lecture.courseid = ?',
					[courseid],
				);

			return rows ?? null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async getCourseIDByLectureID(lectureid: number) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT courseid FROM lecture WHERE lectureid = ?',
					[lectureid],
				);

			return rows[0].courseid ?? null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	// other methods...
};

export default lectureModel;
