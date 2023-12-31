import { FieldPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import createPool from '../config/createPool.js';

const pool = createPool('ADMIN');
/**
 * Interface for Lecture.
 */
export interface Lecture {
	lectureid: number;
	start_date: Date;
	end_date: Date;
	topicid: number;
	courseid: number;
}

/**
 * Interface for LectureModel.
 */ 
export interface LectureModel {
	/**
	 * Finds a lecture by its ID and gets all users in the linked course.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to an array of RowDataPacket.
	 */
	findByLectureIdAndGetAllUserInLinkedCourse(
		lectureid: number,
	): Promise<RowDataPacket[]>;
	/**
	 * Gets students by lecture ID.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to an array of RowDataPacket.
	 */
	getStudentsByLectureId(lectureid: number): Promise<RowDataPacket[]>;
	/**
	 * Deletes a lecture by its ID.
	 * @param id - The ID of the lecture.
	 * @returns A promise that resolves when the deletion is complete.
	 */
	deleteByLectureId(id: string): Promise<void>;
	/**
	 * Counts all lectures.
	 * @returns A promise that resolves to the number of lectures.
	 */
	countAllLecturees(): Promise<number>;
	/**
	 * Finds lectures by topic ID.
	 * @param topicid - The ID of the topic.
	 * @returns A promise that resolves to an array of lectures.
	 */
	findByTopicId(topicid: number): Promise<Lecture[]>;
	/**
	 * Gets the course ID by lecture ID.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to the ID of the course linked to the lecture.
	 */
	getCourseidByLectureid(lectureid: number): Promise<number>;
	/**
	 * Inserts a lecture.
	 * @param start_date - The start date of the lecture.
	 * @param end_date - The end date of the lecture.
	 * @param timeofday - The time of day of the lecture.
	 * @param topicid - The ID of the topic.
	 * @param courseid - The ID of the course.
	 * @param state - The state of the lecture.
	 * @param teacherid - The ID of the teacher.
	 * @returns A promise that resolves when the insertion is complete.
	 */
	insertIntoLecture(
		start_date: Date,
		end_date: Date,
		timeofday: string,
		topicid: number,
		courseid: number,
		state: string,
		teacherid: number | undefined,
	): Promise<unknown>;
	/**
	 * Gets a lecture with its course and topic.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to the lecture with its course and topic, if found.
	 */
	getLectureWithCourseAndTopic(lectureid: string): Promise<RowDataPacket | null>;
	/**
	 * Updates the state of a lecture.
	 * @param lectureid - The ID of the lecture.
	 * @param state - The new state of the lecture.
	 * @returns A promise that resolves when the update is complete.
	 */
	updateLectureState(lectureid: string, state: string): Promise<unknown>;
	/**
	 * Gets lectures by course ID.
	 * @param courseid - The ID of the course.
	 * @returns A promise that resolves to an array of lectures for the course, if found.
	 */
	getLecturesByCourseId(courseid: number): Promise<RowDataPacket[] | null>;
	/**
	 * Gets the course ID by lecture ID.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to the ID of the course linked to the lecture.
	 */
	getCourseIDByLectureID(lectureid: string): Promise<number | null>;
	/**
	 * Fetches all lectures.
	 * @returns A promise that resolves to an array of lectures.
	 */
	fetchAllLecturees(): Promise<
		RowDataPacket[] | [RowDataPacket[], FieldPacket[]]
	>;

	findByLectureIdAndGetAllUserInLinkedCourse(
		lectureid: number,
	): Promise<RowDataPacket[]>;
	/**
	 * Finds open lectures by course ID.
	 * @param courseid - The ID of the course.
	 * @returns A promise that resolves to an array of open lectures for the course, if found.
	 */
	findOpenLecturesBycourseid(courseid: number): Promise<RowDataPacket[] | null>;
	/**
	 * Gets a lecture by its ID.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to the lecture, if found.
	 */
	getLectureByLectureId(lectureid: number): Promise<RowDataPacket[] | null>;
}

/**
 * Represents a lecture model.
 */
const lectureModel: LectureModel = {
	/**
	 * Fetches all lectures.
	 * @returns A promise that resolves to an array of lectures.
	 */
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
	/**
	 * Finds a lecture by its ID and gets all users in the linked course.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to an array of users in the linked course.
	 */
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
	/**
	 * Gets students by lecture ID.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to an array of students in the lecture.
	 */
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
	/**
	 * Deletes a lecture by its ID.
	 * @param id - The ID of the lecture.
	 * @returns A promise that resolves when the deletion is complete.
	 */
	async deleteByLectureId(id: string): Promise<void> {
		try {
			await pool.promise().query('DELETE FROM lecture WHERE lectureid = ?', [id]);
		} catch (error) {
			console.error(error);
		}
	},
	/**
	 * Counts all lectures.
	 * @returns A promise that resolves to the number of lectures.
	 */
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
	/**
	 * Finds a lecture by its topic ID.
	 * @param topicid - The ID of the topic.
	 * @returns A promise that resolves to the lectures with the given topic ID.
	 */
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
	/**
	 * Gets the course ID by lecture ID.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to the ID of the course linked to the lecture.
	 */
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
	/**
	 * Inserts a new lecture.
	 * @param start_date - The start date of the lecture.
	 * @param end_date - The end date of the lecture.
	 * @param timeofday - The time of day of the lecture.
	 * @param topicid - The ID of the topic.
	 * @param courseid - The ID of the course.
	 * @param state - The state of the lecture.
	 * @param teacherid - The ID of the teacher.
	 * @returns A promise that resolves to the result of the insertion.
	 */
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
	/**
	 * Gets a lecture with its course and topic.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to the lecture with its course and topic, if found.
	 * If an error occurs, the promise is rejected.
	 */
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
	/**
	 * Updates the state of a lecture.
	 * @param lectureid - The ID of the lecture.
	 * @param state - The new state of the lecture.
	 * @returns A promise that resolves when the update is complete.
	 * If an error occurs, the promise is rejected.
	 */
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
	/**
	 * Gets lectures by course ID.
	 * @param courseid - The ID of the course.
	 * @returns A promise that resolves to an array of lectures for the course, if found.
	 * If an error occurs, the promise is rejected.
	 */
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
	/**
	 * Gets the course ID by lecture ID.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to the ID of the course linked to the lecture.
	 * If an error occurs, the promise is rejected.
	 */
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
	/**
	 * Finds open lectures by course ID.
	 * @param courseid - The ID of the course.
	 * @returns A promise that resolves to an array of open lectures for the course, if found.
	 * If an error occurs, the promise is rejected.
	 */
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
	/**
	 * Gets a lecture by its ID.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to the lecture, if found.
	 * If an error occurs, the promise is rejected.
	 */
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
