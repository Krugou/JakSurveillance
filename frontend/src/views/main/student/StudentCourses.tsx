import React, { useContext, useEffect, useState } from 'react';
import StudentCourseGrid from '../../../components/main/course/StudentCourseGrid';
import { UserContext } from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';
/**
 * StudentCourses component.
 *
 * This component is responsible for rendering the courses for a student. It performs the following operations:
 *
 * 1. Fetches the user data from the UserContext.
 * 2. Fetches the course data for the user from the API.
 * 3. Renders the courses using the StudentCourseGrid component.
 * 4. Provides an option to show or hide ended courses.
 *
 * If an error occurs while fetching the course data, it renders an error message.
 *
 * @returns A JSX element representing the student courses component.
 */
const StudentCourses: React.FC = () => {
	/**
	 * Interface for the course data.
	 *
	 * This interface represents the structure of a course object in the application. It includes the following properties:
	 *
	 * @property {number} courseid - The unique identifier for the course.
	 * @property {string} course_name - The name of the course.
	 * @property {string} startDate - The start date of the course, represented as a string.
	 * @property {string} endDate - The end date of the course, represented as a string.
	 * @property {string} code - The code of the course.
	 * @property {number | null} student_group - The student group associated with the course. If no student group is associated, this property is null.
	 * @property {string} topic_names - The names of the topics covered in the course, represented as a string.
	 * @property {string} selected_topics - The topics selected for the course, represented as a string.
	 * @property {string} instructor_name - The name of the instructor for the course.
	 * @property {number} usercourseid - The unique identifier for the user-course relationship.
	 */
	interface Course {
		courseid: number;
		course_name: string;
		startDate: string;
		endDate: string;
		code: string;
		student_group: number | null;
		topic_names: string;
		selected_topics: string;
		instructor_name: string;
		usercourseid: number;
	}

	// State to keep track of the error
	const [error, setError] = useState<string | null>(null);

	// State to keep track of the courses
	const {user} = useContext(UserContext);

	// State to keep track of the courses
	const [courses, setCourses] = useState<Course[]>([]);

	// State to keep track of the show ended courses option
	const [showEndedCourses, setShowEndedCourses] = useState(true);

	// Fetch courses for the user
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (user && token !== null) {
					const data = await apiHooks.getAllCourseInfoByUserEmail(token);
					console.log(data, 'DATA');
					setCourses(data);
				}
			} catch (error) {
				setError('No Data Available');
			}
		};
		fetchCourses();
	}, [user]);

	if (error) {
		return <div>Error: {error}</div>;
	}
	return (
		<div className="flex flex-col items-center justify-center rounded-lg h-fit p-5 bg-gray-100">
			<h1 className="text-2xl sm:text-4xl font-bold mb-8 text-center">
				Your Courses
			</h1>
			<label className="flex items-center relative w-max cursor-pointer select-none">
				<span className="text-lg font-bold mr-3">Show old courses</span>
				<input
					type="checkbox"
					className="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-white"
					checked={showEndedCourses}
					onChange={() => setShowEndedCourses(!showEndedCourses)}
				/>
				<span className="absolute font-medium text-xs uppercase right-1 text-white">
					{' '}
				</span>
				<span className="absolute font-medium text-xs uppercase right-8 text-white">
					{' '}
				</span>
				<span
					className={`w-7 h-7 right-7 absolute rounded-full transform transition-transform ${
						showEndedCourses ? ' bg-green-400 translate-x-7' : 'bg-red-500'
					}`}
				/>
			</label>
			<StudentCourseGrid courses={courses} showEndedCourses={showEndedCourses} />
		</div>
	);
};

export default StudentCourses;
