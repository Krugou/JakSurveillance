import CircularProgress from '@mui/material/CircularProgress';
import React, {useContext, useEffect, useState} from 'react';
import Card from '../../../components/main/cards/Card';
import FeedbackCard from '../../../components/main/cards/FeedbackCard';
import CheckOpenLectures from '../../../components/main/course/attendance/CheckOpenLectures';
import WelcomeModal from '../../../components/main/modals/WelcomeModal';
import MainViewTitle from '../../../components/main/titles/MainViewTitle';
import {UserContext} from '../../../contexts/UserContext';
import apihooks from '../../../hooks/ApiHooks';
/**
 * MainView component.
 * This component is responsible for rendering the main view for a teacher.
 * It uses the UserContext to get the current user and displays a loading spinner until the user data is available.
 * It also fetches the courses taught by the teacher and displays them in cards.
 */
const MainView: React.FC = () => {
	const {user} = useContext(UserContext);
	const [courses, setCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		/**
		 * Fetches the courses taught by the teacher.
		 * It sends a GET request to the courses endpoint with the teacher's email,
		 * and updates the state with the fetched courses.
		 */
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
					token,
				);
				setCourses(fetchedCourses);
			}
			setIsLoading(false);
		};
		fetchCourses();
	}, [user]);

	return (
		<>
			<MainViewTitle role={'Teacher'} />
			{isLoading ? (
				<div className="flex justify-center items-center">
					<CircularProgress />
				</div>
			) : (
				<>
					<div
						className={`${
							courses.length === 0
								? 'flex flex-col md:flex-row flex-wrap'
								: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
						} p-5 justify-center items-center gap-4`}
					>
						{courses.length === 0 && (
							<div>
								<div className="animate-bounce p-2 rounded-md bg-metropoliaMainOrange gap-1 flex md:flex-row flex-col items-center">
									<p className="text-center text-white text-lg">Start Here!</p>
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
								<CheckOpenLectures />
								<Card
									path="/teacher/attendance/createlecture"
									title="Create new Lecture"
									description="Open attendance gathering"
								/>
								<Card
									path="/teacher/courses/stats"
									title="Show Attendance stats"
									description="Open attendance stats page"
								/>
							</>
						)}
						<Card
							path="/teacher/lectures"
							title="Your lectures"
							description="View all of your lectures"
						/>
						<FeedbackCard role="teacher" />
					</div>
					<WelcomeModal />
				</>
			)}
		</>
	);
};

export default MainView;
