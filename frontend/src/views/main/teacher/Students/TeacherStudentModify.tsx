import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * TeacherStudentModify component.
 * This component is responsible for rendering the view for a teacher to modify a single student's details.
 * It uses the useParams hook to get the student's ID from the URL parameters.
 * It also provides a form for the teacher to modify the student's name and email.
 */
const TeacherStudentModify: React.FC = () => {
	const {id} = useParams<{id: string}>();

	// Replace with actual data fetching
	const student = {
		name: `Student ${id}`,
		email: `student${id}@example.com`,
	};

	const [name, setName] = useState(student.name);
	const [email, setEmail] = useState(student.email);
	/**
	 * Handles the form submission.
	 * It prevents the default form submission behavior and logs the modified student's name and email.
	 *
	 * @param event - The form event.
	 */
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// Handle the form submission here
		console.log(`Student Modified: ${name}, ${email}`);
	};

	return (
		<div className="bg-gray-100 p-5">
			<div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
				<form onSubmit={handleSubmit} className="px-6 py-4">
					<label className="font-bold text-xl mb-2">Student Name</label>
					<input
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
						className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
					/>
					<label className="font-bold text-xl mb-2">Student Email</label>
					<input
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
					/>
					<button
						type="submit"
						className="w-full p-2 text-white transition font-bold rounded bg-metropoliaMainOrange hover:hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-blue-600"
					>
						Modify Student
					</button>
				</form>
			</div>
		</div>
	);
};

export default TeacherStudentModify;
