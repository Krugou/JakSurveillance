import {FieldPacket, RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';

const pool = createPool('ADMIN');
interface Attendance {
	attendanceid: number;
	studentid: number;
	courseid: number;
	attended: boolean;
}

interface AttendanceModel {
	fetchAllAttendances(): Promise<[RowDataPacket[], FieldPacket[]]>;
	findByAttendanceId(id: number): Promise<Attendance | null>;
	findAllAttendancesByUserCourseId(
		usercourseId: number,
		userid: number,
	): Promise<any>;

	updateAttendanceStatus: (usercourseid: number, status: number) => Promise<any>;

	getUserInfoByUserCourseId: (usercourseid: number) => Promise<any>;
	getAttendaceByCourseId: (courseid: string) => Promise<any>;
	getAttendanceById: (insertid: number) => Promise<any>;
	getAttendanceByUserCourseIdDateLectureId: (
		usercourseid: number,
		date: string,
		lectureid: string,
	) => Promise<any>;
	checkAttendance: (usercourseid: number, lectureid: number) => Promise<any>;
	getLectureCountByTopic: (courseid: string) => Promise<any>;
	deleteAttendance: (usercourseid: number, lectureid: number) => Promise<any>;
	insertAttendance: (
		status: number,
		date: string,
		usercourseid: string,
		lectureid: string,
	) => Promise<any>;
}

const attendanceModel: AttendanceModel = {
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

	async findAllAttendancesByUserCourseId(usercourseId, userid) {
		try {
			//console.log(userid, 'USERIDDD');
			const [rows] = await pool.promise().query<RowDataPacket[]>(
				`SELECT attendance.status, attendance.attendanceid, lecture.start_date, lecture.timeofday, topics.topicname, courses.name, users.email AS teacher
            FROM attendance 
            JOIN lecture ON attendance.lectureid = lecture.lectureid
            JOIN topics ON lecture.topicid = topics.topicid
            JOIN courses ON lecture.courseid = courses.courseid
            JOIN usercourses ON attendance.usercourseid = usercourses.usercourseid
						JOIN courseinstructors ON usercourses.courseid = courseinstructors.courseid
						JOIN users ON courseinstructors.userid = users.userid
            WHERE attendance.usercourseid = ? AND usercourses.userid = ?;`,
				[usercourseId, userid],
			);
			return rows;
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	},

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
	async checkAttendance(usercourseid: number, lectureid: number) {
		const [attendanceResultCheck] = await pool
			.promise()
			.query('SELECT * FROM attendance WHERE usercourseid = ? AND lectureid = ?', [
				usercourseid,
				lectureid,
			]);
		return attendanceResultCheck;
	},
	async getAttendanceById(insertid: number) {
		const [attendanceResult] = await pool
			.promise()
			.query('SELECT * FROM attendance WHERE attendanceid = ?', [insertid]);
		return attendanceResult;
	},
	async getUserInfoByUserCourseId(usercourseid: number) {
		const [userResult] = (await pool
			.promise()
			.query(
				'SELECT * FROM users WHERE userid IN (SELECT userid FROM usercourses WHERE usercourseid = ?)',
				[usercourseid],
			)) as RowDataPacket[];
		return userResult[0];
	},
	async getAttendaceByCourseId(courseid: string) {
		const [attendanceResult] = await pool.promise().query(
			`SELECT attendance.status, attendance.attendanceid, usercourses.usercourseid, lecture.start_date, lecture.timeofday, topics.topicname, courses.name, users.email AS teacher, attendingUsers.first_name, attendingUsers.last_name, attendingUsers.studentnumber, attendingUsers.email, attendingUsers.userid
			FROM attendance 
			JOIN lecture ON attendance.lectureid = lecture.lectureid
			JOIN topics ON lecture.topicid = topics.topicid
			JOIN courses ON lecture.courseid = courses.courseid
			JOIN usercourses ON attendance.usercourseid = usercourses.usercourseid
			JOIN courseinstructors ON courses.courseid = courseinstructors.courseid
			JOIN users ON courseinstructors.userid = users.userid
			JOIN users AS attendingUsers ON usercourses.userid = attendingUsers.userid
			WHERE lecture.courseid = ?`,
			[courseid],
		);
		return attendanceResult;
	},
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
