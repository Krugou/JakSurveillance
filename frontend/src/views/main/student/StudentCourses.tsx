import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';
import StudentCourseGrid from '../../../components/main/course/StudentCourseGrid';
const StudentCourses: React.FC = () => {
	// Interface for the course data
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

	/*
	const getAttendanceColorClass = (attendance: number) => {
		if (attendance >= 90) {
			return 'bg-metropoliaTrendGreen';
		} else if (attendance >= 50) {
			return 'bg-metropoliaMainOrange';
		} else {
			return 'bg-metropoliaSupportRed';
		}
	};
*/
	if (error) {
		return <div>Error: {error}</div>;
	}
	return (
		<div className="flex flex-col items-center justify-center h-1/2 p-8 bg-gray-100">
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
