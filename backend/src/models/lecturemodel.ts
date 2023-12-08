import {FieldPacket, ResultSetHeader, RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';

const pool = createPool('ADMIN');
interface Lecture {
	lectureid: number;
	start_date: Date;
	end_date: Date;
	topicid: number;
	courseid: number;
}

interface LectureModel {
	fetchAllLecturees(): Promise<RowDataPacket[]>;
	findByLectureIdAndGetAllUserInLinkedCourse(
		lectureid: number,
	): Promise<RowDataPacket[]>;
	getStudentsByLectureId(lectureid: number): Promise<RowDataPacket[]>;
	deleteByLectureId(id: string): Promise<void>;
	countAllLecturees(): Promise<number>;
	findByTopicId(topicid: number): Promise<Lecture[]>;
	getCourseidByLectureid(lectureid: number): Promise<number>;
	insertIntoLecture(
		start_date: Date,
		end_date: Date,
		timeofday: string,
		topicid: number,
		courseid: number,
		state: string,
		teacherid: number | undefined,
	): Promise<unknown>;
	getLectureWithCourseAndTopic(lectureid: string): Promise<RowDataPacket | null>;
	updateLectureState(lectureid: string, state: string): Promise<unknown>;
	getLecturesByCourseId(courseid: number): Promise<RowDataPacket[] | null>;
	getCourseIDByLectureID(lectureid: string): Promise<number | null>;
	fetchAllLecturees(): Promise<
		RowDataPacket[] | [RowDataPacket[], FieldPacket[]]
	>;
	findByLectureIdAndGetAllUserInLinkedCourse(
		lectureid: number,
	): Promise<RowDataPacket[]>;
	findOpenLecturesBycourseid(courseid: number): Promise<RowDataPacket[] | null>;
	getLectureByLectureId(lectureid: number): Promise<RowDataPacket[] | null>;
}

const lectureModel: LectureModel = {
	async fetchAllLecturees() {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM lecture');
			return rows;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

	async findByLectureIdAndGetAllUserInLinkedCourse(
		lectureid: number,
	): Promise<RowDataPacket[]> {
		try {
			const [lectureRows] = await pool
				.promise()
				.query('SELECT * FROM lecture WHERE lectureid = ?', [lectureid]);
			const lectureData = (lectureRows as RowDataPacket[])[0];
			if (!lectureData) {
				throw new Error(`Lecture with lectureid ${lectureid} not found`);
			}

			const [courseRows] = await pool
				.promise()
				.query('SELECT * FROM courses WHERE courseid = ?', [lectureData.courseid]);
			const courseData = (courseRows as RowDataPacket[])[0];
			if (!courseData) {
				throw new Error(`Course with courseid ${lectureData.courseid} not found`);
			}

			const [userRows] = await pool
				.promise()
				.query(
					'SELECT u.* FROM users u JOIN usercourses uc ON u.userid = uc.userid WHERE uc.courseid = ?',
					[courseData.courseid],
				);
			return userRows as RowDataPacket[];
		} catch (error) {
			console.error(error);
			throw error;
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
			const uniqueUserRows = userRows.reduce<RowDataPacket[]>((unique, o) => {
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

	async deleteByLectureId(id: string): Promise<void> {
		try {
			await pool.promise().query('DELETE FROM lecture WHERE lectureid = ?', [id]);
		} catch (error) {
			console.error(error);
		}
	},

	async countAllLecturees(): Promise<number> {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM lecture');
			return rows[0].count;
		} catch (error) {
			console.error(error);
			return 0;
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
	async getCourseidByLectureid(lectureid) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT courseid FROM lecture WHERE lectureid = ?',
					[lectureid],
				);

			return rows[0].courseid;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async insertIntoLecture(
		start_date: Date,
		end_date: Date,
		timeofday: string,
		topicid: number,
		courseid: number,
		state: string,
		teacherid: number | undefined,
	): Promise<ResultSetHeader> {
		const [result] = await pool
			.promise()
			.query<ResultSetHeader>(
				'INSERT INTO lecture (start_date, end_date, timeofday, topicid, courseid, state, teacherid) VALUES (?, ?, ?, ?, ?, ?, ?)',
				[start_date, end_date, timeofday, topicid, courseid, state, teacherid],
			);
		return result;
	},
	async getLectureWithCourseAndTopic(lectureid: string) {
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
	async updateLectureState(lectureid: string, state: string) {
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
	async getCourseIDByLectureID(lectureid: string) {
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

	async findOpenLecturesBycourseid(courseid: number) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					'SELECT lecture.*, users.email as teacher FROM lecture JOIN users on lecture.teacherid = users.userid WHERE courseid = ? AND state = "open"',
					[courseid],
				);

			return rows ?? null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	async getLectureByLectureId(lectureid: number) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM lecture WHERE lectureid = ?', [
					lectureid,
				]);

			return rows ?? null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	// other methods...
};

export default lectureModel;
