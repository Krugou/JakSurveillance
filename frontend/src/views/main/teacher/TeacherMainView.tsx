import React from 'react';
import BackgroundContainer from '../../../components/main/background/background';
import Card from '../../../components/main/cards/Card';

const MainView: React.FC = () => {
	return (
		<BackgroundContainer>
			<h1 className="text-4xl font-bold text-gray-700 mb-5 underline">
				Teacher Dashboard
			</h1>

			<div className="flex 2xl:w-2/5 xl:w-5/6 lg:w-11/12 w-full flex-wrap p-5 justify-center gap-4">
				<Card
					path="/teacher/attendance"
					title="View Attendance"
					description="View your course attendance"
				/>

				<Card
					path="/teacher/students"
					title="Manage Students"
					description="Manage your students details"
				/>

				<Card
					path="/teacher/courses/create"
					title="Create new Course"
					description="Create new course for your students"
				/>

				<Card
					path="/teacher/courses/"
					title="View Courses"
					description="View all of your courses"
				/>

				<Card
					path="/teacher/attendance/createlecture"
					title="Create new Lecture"
					description="Open attendance gathering"
				/>

				<Card
					path="/teacher/helpvideos"
					title="Instructions"
					description="See instructions for all available tasks"
				/>
			</div>
		</BackgroundContainer>
	);
};

export default MainView;
