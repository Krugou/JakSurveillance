import React, {useContext, useState} from 'react';
import {UserContext} from '../../contexts/UserContext';
import apiHooks from '../../hooks/ApiHooks';

const Feedback: React.FC = () => {
	const user = useContext(UserContext);
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
					{topic, text: feedback, userId: user.email},
					token,
				);

				console.log(response);
			} catch (error) {
				console.error(error);
			}
		}
		setFeedback('');
		setTopic('');
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-4">
			<h2 className="text-xl font-bold mb-4">Feedback</h2>
			<form onSubmit={handleSubmit} className="mb-4">
				<select
					value={topic}
					onChange={e => setTopic(e.target.value)}
					className="border rounded p-2 mr-2"
				>
					<option value="">Select a topic</option>
					<option value="User Interface">User Interface</option>
					<option value="Performance">Performance</option>
					<option value="Features">Features</option>
					<option value="Usability">Usability</option>
					<option value="Support">Support</option>
					<option value="Bugs">Bugs</option>
					<option value="Improvements">Improvements</option>
					<option value="Content">Content</option>
					<option value="Navigation">Navigation</option>
					<option value="Accessibility">Accessibility</option>
				</select>
				<input
					type="text"
					value={feedback}
					onChange={e => setFeedback(e.target.value)}
					className="border rounded p-2 mr-2"
					placeholder="Enter your feedback"
				/>
				<button type="submit" className="bg-blue-500 text-white rounded p-2">
					Submit
				</button>
			</form>
			<p>Logged in as: {user.username}</p>
		</div>
	);
};

export default Feedback;
