// Define the new CourseDetails component
import React from 'react';
import InputField from './coursedetails/InputField';
const CourseDetails = ({
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
}) => {
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
				onChange={e => setCourseCode(e.target.value)}
			/>

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
				type="datetime-local"
				name="startDate"
				value={startDate}
				onChange={e => setStartDate(e.target.value)}
			/>
			<InputField
				label="End Date"
				type="datetime-local"
				name="endDate"
				value={endDate}
				onChange={e => setEndDate(e.target.value)}
			/>
		</fieldset>
	);
};

export default CourseDetails;
