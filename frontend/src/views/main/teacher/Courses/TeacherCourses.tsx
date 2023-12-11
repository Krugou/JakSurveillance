import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import GeneralLinkButton from '../../../../components/main/buttons/GeneralLinkButton';
import CourseData from '../../../../components/main/course/CourseData';
import {UserContext} from '../../../../contexts/UserContext';
import apihooks from '../../../../hooks/ApiHooks';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

/**
 * Course interface.
 * This interface defines the shape of a Course object.
 */
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
/**
 * TeacherCourses component.
 * This component is responsible for rendering the list of courses for a teacher.
 * It fetches the courses that the teacher is instructing and provides functionality for the teacher to navigate to the course creation view.
 */
const TeacherCourses: React.FC = () => {
	const {user} = useContext(UserContext);
	const [courses, setCourses] = useState<Course[]>([]); // Specify the type for courses
	const {update, setUpdate} = useContext(UserContext);
	const [showEndedCourses, setShowEndedCourses] = useState(false);

	const navigate = useNavigate();
	useEffect(() => {
		const fetchCourses = async () => {
			if (user) {
				// Get token from local storage
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				// Fetch courses by instructor email
				const courses = await apihooks.getAllCoursesByInstructorEmail(
					user.email,
					token,
				);

				setCourses(courses);
			}
		};

		fetchCourses();
	}, [user, update]);

	const updateView = () => {
		setUpdate(!update);
	};
	return (
		<div className="w-full">
			<h2 className="font-bold text-3xl p-3 bg-white w-fit ml-auto mr-auto rounded-lg text-center xl:text-4xl">
				My courses
			</h2>
			<div className="2xl:w-3/4 bg-gray-100 mt-5 w-full p-5 m-auto rounded-lg">
				<div className="flex flex-col gap-5 sm:gap-0 sm:flex-row justify-between">
					<GeneralLinkButton
						path={`/${user?.role}/mainview`}
						text="Back to mainview"
					/>
					<FormControlLabel
						control={
							<Switch
								checked={showEndedCourses}
								onChange={() => setShowEndedCourses(!showEndedCourses)}
								name="showEndedCourses"
								color="primary"
							/>
						}
						label="Show ended courses"
					/>
				</div>
				<div className="grid max-h-[30em] mt-5 2xl:max-h-[50em] overflow-y-scroll w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 m-auto">
					{courses.length > 0 && (
						<CourseData
							courseData={courses}
							updateView={updateView}
							allCourses={true}
							showEndedCourses={showEndedCourses}
						/>
					)}
					<div
						className="p-5 rounded-lg mt-4 mb-4 bg-gray-200 cursor-pointer hover:bg-gray-300 relative flex justify-center items-center"
						onClick={() => navigate('/teacher/courses/create')}
					>
						<button className="flex flex-col items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								className="h-8 w-8 mb-2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							Add new course
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeacherCourses;
