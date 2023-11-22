import React from 'react';
import InputField from './coursedetails/InputField';
const AddTeachers = ({
	instructors,
	handleInputChange,
	setInstructors,
	instructorEmail,
	modify = false,
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
		<fieldset className="mb-5">
			{!modify ? (
				<legend className="text-xl mb-3">Add teachers</legend>
			) : (
				<legend className="text-xl mb-3">Modify teachers</legend>
			)}
			{instructors.map((instructor, index) => (
				<div key={index} className="flex items-center mb-3">
					<div className="flex flex-col mb-3">
						<InputField
							type="text"
							name="email"
							label="Email"
							value={instructor.email}
							onChange={event => handleInputChange(index, event)}
						/>
					</div>
					{instructors.length > 1 && instructor.email !== instructorEmail && (
						<button
							className="ml-2 w-8 p-2 mt-5 bg-red-500 text-white font-bold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
							onClick={() => deleteInstructor(index)}
						>
							x
						</button>
					)}
				</div>
			))}
			<button
				className="w-48 p-1 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
				onClick={addInstructor}
			>
				Add another teacher
			</button>
		</fieldset>
	);
};
export default AddTeachers;
