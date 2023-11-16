import React from 'react';
const AddTeachers = ({
	instructors,
	handleInputChange,
	setInstructors,
	instructorEmail,
}) => {
	const deleteInstructor = index => {
		const newInstructors = [...instructors];
		newInstructors.splice(index, 1);
		setInstructors(newInstructors);
	};
	const addInstructor = () => {
		setInstructors([...instructors, {email: ''}]);
	};
	return (
		<fieldset>
			<legend className="text-xl mb-3">Add teachers</legend>
			{instructors.map((instructor, index) => (
				<div key={index} className="flex justify-between items-center mb-3">
					<input
						className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
						value={instructor.email}
						onChange={event => handleInputChange(index, event)}
					/>
					{instructors.length > 1 && instructor.email !== instructorEmail && (
						<button
							className="ml-2 p-2 bg-red-500 text-white font-bold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
							onClick={() => deleteInstructor(index)}
						>
							x
						</button>
					)}
				</div>
			))}
			<button
				className="w-full p-2 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
				onClick={addInstructor}
			>
				Add another teacher
			</button>
		</fieldset>
	);
};
export default AddTeachers;
