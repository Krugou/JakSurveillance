import {FieldPacket, RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';

const pool = createPool('ADMIN');
/**
 * Interface for Attendance
 */
interface Attendance {
	attendanceid: number;
	studentid: number;
	courseid: number;
	attended: boolean;
}
/**
 * Interface for AttendanceModel
 */
interface AttendanceModel {
	/**
	 * Fetch all attendances
	 */
	fetchAllAttendances(): Promise<[RowDataPacket[], FieldPacket[]]>;
	/**
	 * Find attendance by attendance id
	 * @param id - The id of the attendance
	 */
	findByAttendanceId(id: number): Promise<Attendance | null>;
	/**
	 * Find all attendances by user course id
	 * @param usercourseId - The id of the user course
	 * @param userid - The id of the user
	 */
	findAllAttendancesByUserCourseId(
		usercourseId: number,
		userid: number,
	): Promise<any>;

	/**
	 * Updates the attendance status for a specific attendance record.
	 * @param attendanceid - The ID of the attendance record to update.
	 * @param status - The new status to set for the attendance record.
	 * @returns A promise that resolves to true if the update was successful, false otherwise.
	 */
	updateAttendanceStatus: (attendanceid: number, status: number) => Promise<any>;

	/**
	 * Retrieves user information for a specific user course.
	 * @param usercourseid - The ID of the user course to retrieve information for.
	 * @returns A promise that resolves to the user information.
	 */
	getUserInfoByUserCourseId: (usercourseid: number) => Promise<any>;

	/**
	 * Retrieves attendance records for a specific course.
	 * @param courseid - The ID of the course to retrieve attendance records for.
	 * @returns A promise that resolves to the attendance records.
	 */
	getAttendaceByCourseId: (courseid: string) => Promise<any>;

	/**
	 * Retrieves an attendance record by its ID.
	 * @param insertid - The ID of the attendance record to retrieve.
	 * @returns A promise that resolves to the attendance record.
	 */
	getAttendanceById: (insertid: number) => Promise<any>;

	/**
	 * Retrieves an attendance record for a specific user course, date, and lecture.
	 * @param usercourseid - The ID of the user course.
	 * @param date - The date of the attendance.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to the attendance record.
	 */
	getAttendanceByUserCourseIdDateLectureId: (
		usercourseid: number,
		date: string,
		lectureid: string,
	) => Promise<any>;

	/**
	 * Checks if an attendance record exists for a specific user course and lecture.
	 * @param usercourseid - The ID of the user course.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves to the attendance record if it exists, null otherwise.
	 */
	checkAttendance: (usercourseid: number, lectureid: number) => Promise<any>;

	/**
	 * Retrieves the count of lectures for each topic in a specific course.
	 * @param courseid - The ID of the course.
	 * @returns A promise that resolves to the count of lectures for each topic.
	 */
	getLectureCountByTopic: (courseid: string) => Promise<any>;

	/**
	 * Deletes an attendance record for a specific user course and lecture.
	 * @param usercourseid - The ID of the user course.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves when the deletion is complete.
	 */
	deleteAttendance: (usercourseid: number, lectureid: number) => Promise<any>;

	/**
	 * Inserts a new attendance record.
	 * @param status - The status of the attendance.
	 * @param date - The date of the attendance.
	 * @param usercourseid - The ID of the user course.
	 * @param lectureid - The ID of the lecture.
	 * @returns A promise that resolves when the insertion is complete.
	 */
	insertAttendance: (
		status: number,
		date: string,
		usercourseid: string,
		lectureid: string,
	) => Promise<any>;
}

const attendanceModel: AttendanceModel = {
	/**
	 * Updates the attendance status for a user course.
	 *
	 * @param {number} usercourseid - The ID of the user course.
	 * @param {number} status - The new attendance status.
	 * @returns {Promise<any>} A promise that resolves when the update is complete.
	 */
	async updateAttendanceStatus(attendanceid: number, status: number) {
		try {
			if (attendanceid === 0) {
				throw new Error('Invalid usercourseid');
			}

			const result = await pool
				.promise()
				.query(
					'UPDATE attendance SET status = ? WHERE attendanceid = ? ORDER BY date DESC LIMIT 1',
					[status, attendanceid],
				);

			console.log('Update result:', result);

			return true;
		} catch (error) {
			console.error('Error updating attendance status:', error);
			return false;
		}
	},
	/**
	 * Fetches all attendance records.
	 *
	 * @returns {Promise<[RowDataPacket[], FieldPacket[]]>} A promise that resolves with all attendance records.
	 */
	async fetchAllAttendances() {
		try {
			return await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM attendance');
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	/**
	 * Finds an attendance record by its ID.
	 *
	 * @param {number} id - The ID of the attendance record.
	 * @returns {Promise<Attendance | null>} A promise that resolves with the attendance record or null if not found.
	 */
	async findByAttendanceId(id) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>('SELECT * FROM attendance WHERE attendanceid = ?', [
					id,
				]);
			return (rows[0] as Attendance) || null;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	/**
	 * Finds all attendance records for a specific user course.
	 *
	 * @param {number} usercourseId - The ID of the user course.
	 * @param {number} userid - The ID of the user.
	 * @returns {Promise<any>} A promise that resolves with the attendance records for the user course.
	 */
	async findAllAttendancesByUserCourseId(usercourseId, userid) {
		try {
			//console.log(userid, 'USERIDDD');
			const [rows] = await pool.promise().query<RowDataPacket[]>(
				`SELECT 
				attendance.status, 
				attendance.attendanceid, 
				lecture.start_date, 
				lecture.timeofday, 
				topics.topicname, 
				courses.name, 
				teachers.email AS teacher
			FROM 
				attendance 
			JOIN 
				lecture ON attendance.lectureid = lecture.lectureid
			JOIN 
				topics ON lecture.topicid = topics.topicid
			JOIN 
				courses ON lecture.courseid = courses.courseid
			JOIN 
				usercourses ON attendance.usercourseid = usercourses.usercourseid
			JOIN 
				users AS teachers ON lecture.teacherid = teachers.userid
			WHERE 
				attendance.usercourseid = ? AND usercourses.userid = ?;`,
				[usercourseId, userid],
			);
			return rows;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},
	/**
	 * Gets the attendance by user course ID, date, and lecture ID.
	 *
	 * @param {number} usercourseid - The ID of the user course.
	 * @param {string} date - The date of the attendance.
	 * @param {string} lectureid - The ID of the lecture.
	 * @returns {Promise<any>} The attendance details.
	 */
	async getAttendanceByUserCourseIdDateLectureId(
		usercourseid: number,
		date: string,
		lectureid: string,
	) {
		const [attendanceResult] = await pool
			.promise()
			.query(
				'SELECT * FROM attendance WHERE usercourseid = ? AND date = ? AND lectureid = ?',
				[usercourseid, date, lectureid],
			);
		return attendanceResult;
	},
	/**
	 * Inserts a new attendance.
	 *
	 * @param {number} status - The attendance status.
	 * @param {string} date - The date of the attendance.
	 * @param {string} usercourseid - The ID of the user course.
	 * @param {string} lectureid - The ID of the lecture.
	 * @returns {Promise<any>} A promise that resolves when the insertion is complete.
	 */
	async insertAttendance(
		status: number,
		date: string,
		usercourseid: string,
		lectureid: string,
	) {
		if (!date || !usercourseid || !lectureid) {
			throw new Error('Invalid parameters');
		}

		try {
			return await pool
				.promise()
				.query(
					'INSERT INTO attendance (status, date, usercourseid, lectureid) VALUES (?, ?, ?, ?)',
					[status, date, usercourseid, lectureid],
				);
		} catch (error) {
			console.error(error);
			throw new Error('Failed to insert attendance');
		}
	},
	/**
	 * Checks the attendance for a user course and lecture.
	 *
	 * @param {number} usercourseid - The ID of the user course.
	 * @param {number} lectureid - The ID of the lecture.
	 * @returns {Promise<any>} A promise that resolves with the attendance check result.
	 */
	async checkAttendance(usercourseid: number, lectureid: number) {
		const [attendanceResultCheck] = await pool
			.promise()
			.query('SELECT * FROM attendance WHERE usercourseid = ? AND lectureid = ?', [
				usercourseid,
				lectureid,
			]);
		return attendanceResultCheck;
	},
	/**
	 * Gets the attendance by its ID.
	 *
	 * @param {number} insertid - The ID of the attendance.
	 * @returns {Promise<any>} The attendance details.
	 */
	async getAttendanceById(insertid: number) {
		const [attendanceResult] = await pool
			.promise()
			.query('SELECT * FROM attendance WHERE attendanceid = ?', [insertid]);
		return attendanceResult;
	},
	/**
	 * Gets the user info for a user course.
	 *
	 * @param {number} usercourseid - The ID of the user course.
	 * @returns {Promise<any>} A promise that resolves with the user info.
	 */
	async getUserInfoByUserCourseId(usercourseid: number) {
		const [userResult] = (await pool
			.promise()
			.query(
				'SELECT * FROM users WHERE userid IN (SELECT userid FROM usercourses WHERE usercourseid = ?)',
				[usercourseid],
			)) as RowDataPacket[];
		return userResult[0];
	},

	/**
	 * Gets the attendance by course ID.
	 *
	 * @param {string} courseid - The ID of the course.
	 * @returns {Promise<any>} The attendance details for the course.
	 */
	async getAttendaceByCourseId(courseid: string) {
		const [attendanceResult] = await pool.promise().query(
			`SELECT 
			attendance.status, 
			attendance.attendanceid, 
			usercourses.usercourseid, 
			lecture.start_date, 
			lecture.timeofday, 
			topics.topicname, 
			courses.name, 
			teachers.email AS teacher, 
			attendingUsers.first_name, 
			attendingUsers.last_name, 
			attendingUsers.studentnumber, 
			attendingUsers.email, 
			attendingUsers.userid
		FROM 
			attendance 
		JOIN 
			lecture ON attendance.lectureid = lecture.lectureid
		JOIN 
			topics ON lecture.topicid = topics.topicid
		JOIN 
			courses ON lecture.courseid = courses.courseid
		JOIN 
			usercourses ON attendance.usercourseid = usercourses.usercourseid
		JOIN 
			users AS teachers ON lecture.teacherid = teachers.userid
		JOIN 
			users AS attendingUsers ON usercourses.userid = attendingUsers.userid
		WHERE 
			lecture.courseid = ?;`,
			[courseid],
		);
		return attendanceResult;
	},
	/**
	 * Gets the lecture count by topic for a course.
	 *
	 * @param {string} courseid - The ID of the course.
	 * @returns {Promise<any>} A promise that resolves with the lecture count by topic.
	 */
	async getLectureCountByTopic(courseid: string) {
		const [result] = await pool.promise().query(
			`SELECT topics.topicname, COUNT(lecture.lectureid) AS lecture_count
			FROM coursetopics
			JOIN topics ON coursetopics.topicid = topics.topicid
			LEFT JOIN lecture ON lecture.topicid = topics.topicid AND lecture.courseid = coursetopics.courseid
			WHERE coursetopics.courseid = ?
			GROUP BY topics.topicname;`,
			[courseid],
		);
		return result;
	},
	/**
	 * Deletes the attendance for a user course and lecture.
	 *
	 * @param {number} usercourseid - The ID of the user course.
	 * @param {number} lectureid - The ID of the lecture.
	 * @returns {Promise<any>} A promise that resolves when the deletion is complete.
	 */
	async deleteAttendance(usercourseid: number, lectureid: number) {
		const [result] = await pool
			.promise()
			.query('DELETE FROM attendance WHERE usercourseid = ? AND lectureid = ?', [
				usercourseid,
				lectureid,
			]);

		return result;
	},
};

export default attendanceModel;
