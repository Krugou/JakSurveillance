import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
// this is view for teacher to modify the single course details
const TeacherCourseModify: React.FC = () => {
	const {id} = useParams<{id: string}>();

	// Replace with actual data fetching
	const course = {
		name: `Course ${id}`,
		description: 'Some description about the course.',
	};

	const [name, setName] = useState(course.name);
	const [description, setDescription] = useState(course.description);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// Handle the form submission here
		console.log(`Course Modified: ${name}, ${description}`);
	};

	return (
		<BackgroundContainer>
			<div className="m-4 rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
				<form onSubmit={handleSubmit} className="px-6 py-4">
					<label className="font-bold text-xl mb-2">Course Name</label>
					<input
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
						className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
					/>
					<label className="font-bold text-xl mb-2">Course Description</label>
					<textarea
						value={description}
						onChange={e => setDescription(e.target.value)}
						className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
					/>
					<button
						type="submit"
						className="w-full p-2 text-white font-bold rounded bg-metropoliaMainOrange hover:hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-blue-600"
					>
						Modify Course
					</button>
				</form>
			</div>
		</BackgroundContainer>
	);
};

export default TeacherCourseModify;
