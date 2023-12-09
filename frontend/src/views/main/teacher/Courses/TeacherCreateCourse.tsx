import React from 'react';
import Card from "../../../../components/main/cards/Card";

/**
 * TeacherCreateCourse component.
 * This component is responsible for rendering the view for a teacher to create a new course.
 * It provides two options for the teacher to create a course: Easy mode and Custom mode.
 * In Easy mode, the teacher can create a course easily with their own student data file.
 * In Custom mode, the teacher can create a course with their custom details.
 */
const TeacherCreateCourse: React.FC = () => {
	return (
		<div>
			<div className="w-full pt-10 pb-10">
				<h1 className="text-4xl text-center p-3 bg-white w-fit mr-auto ml-auto rounded-lg font-bold mb-8">Create Course</h1>
				<p className="text-center p-2 bg-white w-fit ml-auto rounded-lg mr-auto mb-4">Choose between routes</p>
				<div className="flex justify-center flex-wrap space-x-4">
					<Card
						path="/teacher/courses/create/easy"
						title="Easy mode"
						description="Create a course easily with your own student data file"
					/>

					<Card
						path="/teacher/courses/create/custom"
						title="Custom mode"
						description="Create a course with your custom details"
					/>
				</div>
			</div>
		</div>
	);
};

export default TeacherCreateCourse;
