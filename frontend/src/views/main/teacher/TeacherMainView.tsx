import React from 'react';
import BackgroundContainer from '../../../components/main/background/BackgroundContainer';
import Card from '../../../components/main/cards/Card';
import MainViewTitle from '../../../components/main/titles/MainViewTitle';
import WelcomeModal from '../../../components/main/modals/WelcomeModal';
const MainView: React.FC = () => {
	return (
		<BackgroundContainer>
			<MainViewTitle role={'Teacher'} />

			<div className="flex 2xl:w-2/5 xl:w-5/6 lg:w-11/12 w-full flex-wrap p-5 justify-center gap-4">
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
					title="Your Courses"
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
			<WelcomeModal />
		</BackgroundContainer>
	);
};

export default MainView;
