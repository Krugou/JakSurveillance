import {RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';

const pool = createPool('ADMIN');

/**
 * Model for interacting with the user_feedback table in the database.
 */
const userFeedBackModel = {
	/**
	 * Get all feedback from a specific user.
	 * @param userId - The ID of the user.
	 * @returns An array of RowDataPacket objects containing the feedback.
	 */
	async getUserFeedback() {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT * FROM user_feedback ', []);
		return rows;
	},

	/**
	 * Insert a new feedback into the user_feedback table.
	 * @param userId - The ID of the user.
	 * @param topic - The topic of the feedback.
	 * @param text - The text of the feedback.
	 * @returns The result of the query.
	 */
	async insertUserFeedback(userId: number, topic: string, text: string) {
		const result = await pool
			.promise()
			.query('INSERT INTO user_feedback (userid, topic, text) VALUES (?, ?, ?)', [
				userId,
				topic,
				text,
			]);
		return result;
	},
	async deleteUserFeedback(feedbackId: number) {
		const result = await pool
			.promise()
			.query('DELETE FROM user_feedback WHERE feedbackId = ?', [feedbackId]);
		return result;
	},

	/**
	 * Count all feedback from a specific user.
	 * @param userId - The ID of the user.
	 * @returns The count of feedback.
	 */
	async countUserFeedback() {
		const [rows] = await pool
			.promise()
			.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM user_feedback ', []);
		return rows[0].count;
	},
};

export default userFeedBackModel;
