import React, {useRef, useState} from 'react';
import apiHooks from '../../../../hooks/ApiHooks';
import InputField from './coursedetails/InputField';

/**
 * Component for adding teachers to a course.
 *
 * @param {Object} props - Component props
 * @param {Array} props.instructors - List of instructors
 * @param {Function} props.setInstructors - Setter for instructors
 * @param {string} props.instructorEmail - Email of the instructor
 * @param {boolean} props.modify - Flag indicating whether the component is in modify mode
 */
const AddTeachers = ({
	instructors,
	setInstructors,
	instructorEmail,
	modify = false,
}) => {
	const [errorMessages, setErrorMessages] = useState<string[]>([]);
	const timeouts = useRef<(number | null)[]>([]);

	// Function to remove an instructor from the list
	const deleteInstructor = index => {
		const newInstructors = [...instructors];
		newInstructors.splice(index, 1);
		setInstructors(newInstructors);
	};

	// Function to add a new instructor to the list
	const addInstructor = () => {
		setInstructors([...instructors, {email: ''}]);
	};

	// Function to handle changes to the instructor email input field
	const handleInputChange = (
		index: number,
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const values = [...instructors];
		values[index].email = event.target.value;
		setInstructors(values);

		// Clear the previous timeout if it exists
		if (timeouts.current[index] !== null) {
			window.clearTimeout(timeouts.current[index] as number);
		}

		// Set a new timeout to check if the instructor exists after the user has stopped typing for 2 seconds
		timeouts.current[index] = window.setTimeout(async () => {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			const response = await apiHooks.checkStaffByEmail(event.target.value, token);
			const exists = response.exists;
			values[index].exists = exists;
			setInstructors(values);

			const newErrorMessages = [...errorMessages];
			if (!exists) {
				newErrorMessages[index] =
					'A staff member with this email doesnt exist in database.';
			} else {
				newErrorMessages[index] = '';
			}
			setErrorMessages(newErrorMessages);
		}, 500);
	};

	return (
		<fieldset className="mb-5">
			{!modify ? <legend className="text-xl mb-3">Add teachers</legend> : <></>}
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
						{errorMessages[index] && (
							<p className="text-red-500">{errorMessages[index]}</p>
						)}
					</div>
					{instructors.length > 1 && instructor.email !== instructorEmail && (
						<button
							className="ml-2 w-8 p-2 mt-5 bg-red-500 text-white transition font-bold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
							onClick={() => deleteInstructor(index)}
						>
							x
						</button>
					)}
				</div>
			))}
			<button
				className="w-48 p-1 mt-2 bg-metropoliaMainOrange text-white transition font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
				onClick={addInstructor}
			>
				Add another teacher
			</button>
		</fieldset>
	);
};

export default AddTeachers;
