const usercourse_topics = {
	async checkIfUserCourseTopicExists(usercourseid: number, topicId: number) {
		const [existingUserCourseTopic] = await pool
			.promise()
			.query<RowDataPacket[]>(
				'SELECT * FROM usercourse_topics WHERE usercourseid = ? AND topicid = ?',
				[usercourseid, topicId],
			);

		return existingUserCourseTopic;
	},

	async insertUserCourseTopic(usercourseid: number, topicId: number) {
		const result = await pool
			.promise()
			.query(
				'INSERT INTO usercourse_topics (usercourseid, topicid) VALUES (?, ?)',
				[usercourseid, topicId],
			);

		return result;
	},
};

export default usercourse_topics;
