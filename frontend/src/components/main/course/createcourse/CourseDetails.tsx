// Define the new CourseDetails component
import React, {useEffect, useState} from 'react';
import apihooks from '../../../../hooks/ApiHooks';
import InputField from './coursedetails/InputField';
/**
 * CourseDetails component properties
 */
interface CourseDetailsProps {
	courseCode: string;
	setCourseCode: (value: string) => void;
	courseName: string;
	setCourseName: (value: string) => void;
	studentGroup: string;
	setStudentGroup: (value: string) => void;
	startDate: string;
	setStartDate: (value: string) => void;
	endDate: string;
	setEndDate: (value: string) => void;
	modify?: boolean;
	courseExists: boolean;
	setCourseExists: (value: boolean) => void;
}

/**
 * CourseDetails is a functional component that renders a form for course details.
 * It checks if the course code already exists and displays appropriate messages.
 *
 * @param props - The properties of the course details form.
 * @returns A JSX element.
 */
const CourseDetails: React.FC<CourseDetailsProps> = ({
	courseCode,
	setCourseCode,
	courseName,
	setCourseName,
	studentGroup,
	setStudentGroup,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	modify = false,
	courseExists,
	setCourseExists,
}) => {
	const [firstCourseCode] = useState(courseCode);
	const [courseCodeChanged, setCourseCodeChanged] = useState(false);
	useEffect(() => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		const delay = 250; // Delay in milliseconds

		const checkCode = async () => {
			const response = await apihooks.checkCourseCode(courseCode, token);
			const exists = response.exists;
			setCourseExists(exists);
		};

		if (!modify) {
			// Only run the check if courseCode has changed
			setTimeout(checkCode, delay);
		} else {
			if (courseCode !== firstCourseCode && firstCourseCode !== '') {
				setTimeout(checkCode, delay);
			}
		}
	}, [courseCode]);
	return (
		<fieldset>
			{modify ? (
				<></>
			) : (
				<legend className="mb-5 ml-1 text-xl">Please check Course Details</legend>
			)}

			<InputField
				label="Course Code"
				type="text"
				name="courseCode"
				value={courseCode}
				onChange={e => {
					setCourseCode(e.target.value);
					setCourseExists(false);
					if (e.target.value !== firstCourseCode) {
						setCourseCodeChanged(true);
					}
				}}
			/>
			{!modify && courseExists && (
				<p className="text-red-400">A course with this code already exists.</p>
			)}
			{modify && courseExists && courseCode !== firstCourseCode && (
				<p className="text-red-400">A course with this code already exists.</p>
			)}

			{modify && courseCode === firstCourseCode && courseCodeChanged && (
				<p className="text-green-400">First course code has been restored.</p>
			)}

			<InputField
				label="Course Name"
				type="text"
				name="courseName"
				value={courseName}
				onChange={e => setCourseName(e.target.value)}
			/>
			<InputField
				label="Student Group"
				type="text"
				name="studentGroup"
				value={studentGroup}
				onChange={e => setStudentGroup(e.target.value)}
			/>
			<InputField
				label="Start Date"
				type="date"
				name="startDate"
				value={startDate ? startDate.split('T')[0] : ''}
				onChange={e => setStartDate(e.target.value)}
			/>
			<InputField
				label="End Date"
				type="date"
				name="endDate"
				value={endDate ? endDate.split('T')[0] : ''}
				onChange={e => setEndDate(e.target.value)}
			/>
		</fieldset>
	);
};

export default CourseDetails;
