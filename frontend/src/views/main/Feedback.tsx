import React, {useContext, useState} from 'react';
import {toast} from 'react-toastify';
import {UserContext} from '../../contexts/UserContext';
import apiHooks from '../../hooks/ApiHooks';
const Feedback: React.FC = () => {
	const {user} = useContext(UserContext);
	const [feedback, setFeedback] = useState('');
	const [topic, setTopic] = useState('');

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (user) {
			// Handle the submission of the feedback
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}

				const response = await apiHooks.postUserFeedback(
					{topic, text: feedback, userId: user.userid},
					token,
				);
				toast.success(
					`Thank you for your feedback! It has been submitted successfully.`,
				);
				console.log(response);
			} catch (error) {
				toast.error('An error occurred while submitting your feedback.');
				console.error(error);
			}
		}
		setFeedback('');
		setTopic('');
	};
	const feedbackTopicsByRole = {
		student: [
			'Qr Code Scanning',
			'User Interface / Accessibility',
			'Attendance info',
			'Other',
		],
		teacher: [
			'User Interface / Accessibility',
			'Course Creation',
			'Lecture Creation',
			'Attendance gathering',
			'Course/Student info',
			'Attendance info',
			'Other',
		],
		counselor: [
			'User Interface / Accessibility',
			'Course/Student info',
			'Attendance info',
			'Other',
		],
		admin: ['User Interface / Accessibility', 'Other'],
	};

	const userRole = user?.role;
	let feedbackTopics = [];
	if (userRole) {
		feedbackTopics = feedbackTopicsByRole[userRole];
	}
	return (
		<div className="bg-white rounded-lg shadow-md p-4">
			<h2 className="text-xl font-bold mb-4">
				Help us improve, {user?.username}. Share your feedback.
			</h2>
			<form onSubmit={handleSubmit} className="mb-4 flex flex-col">
				<label htmlFor="feedback-topic" className="sr-only">
					Feedback Topic
				</label>
				<select
					id="feedback-topic"
					value={topic}
					onChange={e => setTopic(e.target.value)}
					className="border rounded p-2 m-2"
					required
				>
					<option value="">Select a topic</option>
					{feedbackTopics.map((topic, index) => (
						<option key={index} value={topic}>
							{topic}
						</option>
					))}
				</select>
				<label htmlFor="feedback-text" className="sr-only">
					Feedback Text
				</label>
				<textarea
					id="feedback-text"
					value={feedback}
					onChange={e => setFeedback(e.target.value)}
					className="border rounded p-2 m-2"
					rows={8}
					placeholder="Enter your feedback"
					required
				/>
				<button
					type="submit"
					className="bg-metropoliaMainOrange  hover:hover:bg-metropoliaSecondaryOrange transition text-white font-bold py-2 px-4 m-4 rounded focus:outline-none focus:shadow-outline"
				>
					Submit
				</button>
			</form>
			<p className="text-sm text-gray-500 mt-2">
				Verify you have the latest version by checking the version checkmark on the
				login or start view(with moving eye) before submitting.
			</p>
		</div>
	);
};

export default Feedback;
