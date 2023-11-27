import React, { useContext, useEffect, useState } from 'react';
import BackgroundContainer from '../../../components/main/background/BackgroundContainer';
import Card from '../../../components/main/cards/Card';
import MainViewTitle from '../../../components/main/titles/MainViewTitle';
import WelcomeModal from '../../../components/main/modals/WelcomeModal';
import apihooks from '../../../hooks/ApiHooks';
import { UserContext } from '../../../contexts/UserContext';

const MainView: React.FC = () => {
	const { user } = useContext(UserContext);
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const fetchCourses = async () => {
			if (user) {
				// Get token from local storage
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				// Fetch courses by instructor email
				const fetchedCourses = await apihooks.getAllCoursesByInstructorEmail(
					user.email,
					token
				);
				setCourses(fetchedCourses);
			}
		};
		fetchCourses();
	}, [user]);

	return (
		<BackgroundContainer>
			<MainViewTitle role={'Teacher'} />

			<div className="flex flex-col md:flex-row 2xl:w-2/5 xl:w-5/6 lg:w-11/12 w-full flex-wrap p-5 justify-center items-center gap-4">

				{courses.length === 0 && (
					<div className="relative">
						<div className="animate-bounce gap-2 flex md:flex-row flex-col items-center">
							<p className="text-center text-white font-bold">Start Here!</p>
							<div className="w-4 h-4 border-t-2 border-r-2 transform md:rotate-45 rotate-135 border-white"></div>
						</div>
					</div>
				)}
				<Card
					path="/teacher/courses/create"
					title="Create new Course"
					description="Create a new course for your students"
				/>

				{courses.length >= 0 && (
					<Card
						path="/teacher/helpvideos"
						title="Instructions"
						description="See instructions for all available tasks"
					/>
				)}

				{courses.length > 0 && (
					<>
						<Card
							path="/teacher/students"
							title="Manage Students"
							description="Manage your students details"
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
					</>
				)}
			</div>
			<WelcomeModal />
		</BackgroundContainer>
	);
};


export default MainView;
