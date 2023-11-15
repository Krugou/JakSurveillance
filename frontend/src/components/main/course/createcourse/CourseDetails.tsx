// Define the new CourseDetails component
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
}) => {
	return (
		<fieldset>
			<legend className="mb-5 ml-1 text-xl">Please check Course Details</legend>
			<div className="flex flex-col mb-3">
				<label className="mb-2 font-bold text-gray-900">Course Code</label>
				<input
					className="border rounded py-2 px-3 text-grey-800"
					type="text"
					name="courseCode"
					value={courseCode}
					onChange={e => setCourseCode(e.target.value)}
				/>
			</div>
			<div className="flex flex-col mb-3">
				<label className="mb-2 font-bold text-gray-900">Course Name</label>
				<input
					className="border rounded py-2 px-3 text-grey-800"
					type="text"
					name="courseName"
					value={courseName}
					onChange={e => setCourseName(e.target.value)}
				/>
			</div>
			<div className="flex flex-col mb-3">
				<label className="mb-2 font-bold text-gray-900">Student Group</label>
				<input
					className="border rounded py-2 px-3 text-grey-800"
					type="text"
					name="studentGroup"
					value={studentGroup}
					onChange={e => setStudentGroup(e.target.value)}
				/>
			</div>
			<div className="flex flex-col mb-3">
				<label className="mb-2 font-bold text-gray-900">Start Date</label>
				<input
					className="border rounded py-2 px-3 text-grey-800"
					type="datetime-local"
					name="startDate"
					value={startDate}
					onChange={e => setStartDate(e.target.value)}
				/>
			</div>
			<div className="flex flex-col mb-3">
				<label className="mb-2 font-bold text-gray-900">End Date</label>
				<input
					className="border rounded py-2 px-3 text-grey-800"
					type="datetime-local"
					name="endDate"
					value={endDate}
					onChange={e => setEndDate(e.target.value)}
				/>
			</div>
		</fieldset>
	);
};

export default CourseDetails;
