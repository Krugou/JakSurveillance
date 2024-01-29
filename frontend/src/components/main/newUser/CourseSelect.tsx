import React from 'react';

interface Course {
	courseid: number;
	name: string;
	description: string;
	start_date: string;
	end_date: string;
	code: string;
	studentgroup_name: string;
	topic_names: string;
	// Include other properties of course here
}

interface CourseSelectProps {
	courses: Course[];
	selectedCourse: number | null;
	onChange: (value: number) => void;
}

const CourseSelect: React.FC<CourseSelectProps> = ({
	courses,
	selectedCourse,
	onChange,
}) => {
	return (
		<label className="block mt-4">
			<span className="text-gray-700 font-bold">Course</span>
			<select
				required
				value={selectedCourse || ''}
				onChange={e => onChange(Number(e.target.value))}
				className="shadow appearance-none border rounded-3xl cursor-pointer w-full py-2 px-3 text-gray-700 mb-3 mt-1 leading-tight focus:outline-none focus:shadow-outline"
			>
				<option value="null">Select a course</option>
				{courses.map(course => (
					<option key={course.courseid} value={course.courseid}>
						{course.name + '|' + course.code}
					</option>
				))}
			</select>
		</label>
	);
};

export default CourseSelect;
