import React from 'react';
import MainViewButton from '../buttons/MainViewButton';

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

interface CourseDataProps {
	courseData: any;
}

const CourseData: React.FC<CourseDataProps> = ({courseData}) => {
	const currentUrl = window.location.href;
	return (
		<>
			{courseData.map((course: Course) => (
				<div key={course.courseid} className="mt-4">
					<div className="font-bold text-lg">{course.name}</div>
					<p className="text-gray-700 text-base">{course.description}</p>
					<div className="mt-2">
						<div className="flex justify-between">
							<div className="text-gray-700">Start date:</div>
							<div>{new Date(course.start_date).toLocaleDateString()}</div>
						</div>
						<div className="flex justify-between">
							<div className="text-gray-700">End date:</div>
							<div>{new Date(course.end_date).toLocaleDateString()}</div>
						</div>
						<div className="flex justify-between">
							<div className="text-gray-700">Code:</div>
							<div>{course.code}</div>
						</div>
						<div className="flex justify-between">
							<div className="text-gray-700">Student group:</div>
							<div>{course.studentgroup_name}</div>
						</div>
						<div className="flex justify-between">
							<div className="text-gray-700">Topics:</div>
							<div>{course.topic_names}</div>
						</div>
					</div>
					{currentUrl.match(/courses\/\d+/) ? (
						<MainViewButton
							path={`/teacher/courses/${course.courseid}/modify`} // Removed unnecessary ':' character
							text="Modify details"
						/>
					) : (
						<MainViewButton
							path={`/teacher/courses/${course.courseid}`}
							text="View details"
						/>
					)}
				</div>
			))}
		</>
	);
};

export default CourseData;
