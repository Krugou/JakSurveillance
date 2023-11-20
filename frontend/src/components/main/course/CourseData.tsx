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
	created_at: string;
	user_count: number;
	instructor_name: string;

	// Include other properties of course here
}

interface CourseDataProps {
	courseData: object;
}

const CourseData: React.FC<CourseDataProps> = ({courseData}) => {
	const currentUrl = window.location.href;
	console.log(courseData);
	return (
		<>
			{Array.isArray(courseData) &&
				courseData.map((course: Course) => (
					<div key={course.courseid} className="mt-4 bg-white p-5 rounded-lg mb-4">
						<p className="font-bold text-lg">{course.name}</p>
						<p className="text-gray-700 text-base">{course.description}</p>
						<div className="mt-2">
							<div className="flex justify-between">
								<p className="text-gray-700">Start date:</p>
								<p>{new Date(course.start_date).toLocaleDateString()}</p>
							</div>
							<div className="flex justify-between">
								<p className="text-gray-700">End date:</p>
								<p>{new Date(course.end_date).toLocaleDateString()}</p>
							</div>
							<div className="flex justify-between">
								<div className="text-gray-700">Code:</div>
								<div>{course.code}</div>
							</div>
							<div className="flex justify-between">
								<p className="text-gray-700">Student group:</p>
								<p>{course.studentgroup_name}</p>
							</div>
							<div className="flex justify-between mb-2">
								<p className="text-gray-700">Topics:</p>
								<p>{course.topic_names}</p>
							</div>

							{currentUrl.match(/courses\/\d+/) ? (
								<>
									<h2 className="text-xl mt-4"> Additional Info</h2>
									<div className="flex justify-between">
										<p className="text-gray-700">Course Created at:</p>
										<p>{new Date(course.created_at).toLocaleDateString()}</p>
									</div>
									<div className="flex justify-between">
										<p className="text-gray-700">Amount of students</p>
										<p>{course.user_count}</p>
									</div>
									<div className="flex justify-between mb-2">
										<p className="text-gray-700">Instructors: </p>
										<p>{course.instructor_name}</p>
									</div>
									<MainViewButton
										path={`/teacher/courses/${course.courseid}/modify`}
										text="Modify details"
									/>
								</>
							) : (
								<MainViewButton
									path={`/teacher/courses/${course.courseid}`}
									text="View details"
								/>
							)}
						</div>
					</div>
				))}
		</>
	);
};

export default CourseData;
