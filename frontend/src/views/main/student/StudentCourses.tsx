import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import ReportIcon from '@mui/icons-material/Report';
import Tooltip from '@mui/material/Tooltip';
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
	const navigate = useNavigate();

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
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
				{courses
					.filter(course => {
						const endDate = new Date(course.endDate);
						const isCourseEnded =
							endDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
						return !isCourseEnded || showEndedCourses;
					})
					.map(course => {
						// Format the dates
						const startDate = new Date(course.startDate).toLocaleDateString();
						const endDate = new Date(course.endDate);
						const endDateString = endDate.toLocaleDateString();

						// Format the topics
						const topics = course.selected_topics
							? // If the course has selected topics by the student, use those
							  course.selected_topics.replace(/,/g, ', ')
							: // Otherwise use the default topics
							course.topic_names
							? course.topic_names.replace(/,/g, ', ')
							: 'You have no assigned topics on this course';

						// Check if the course has ended
						const isCourseEnded =
							endDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
						return (
							<Tooltip placement="top" title={isCourseEnded ? 'Course has ended' : ''}>
								<div
									key={course.courseid}
									className={`p-6 bg-white shadow-md rounded-lg relative ${
										isCourseEnded ? 'opacity-50' : ''
									}`}
								>
									{isCourseEnded && (
										<div className="absolute top-2 right-2">
											<ReportIcon style={{color: 'red'}} />
										</div>
									)}
									<h2 className="text-2xl underline font-bold mb-2 text-black">
										{course.course_name + ' ' + course.code}
									</h2>
									<p className="mb-1">
										<strong>Your Topics:</strong> {topics}
									</p>
									<p className="mb-1">
										<strong>Start Date:</strong> {startDate}
									</p>
									<p className="mb-1">
										<strong>End Date:</strong> {endDateString}
									</p>
									<p className="mb-1">
										<strong>Course Instructors:</strong> {course.instructor_name}
									</p>
									<button
										className={`mt-4 font-bold py-2 px-4 rounded ${
											isCourseEnded
												? 'bg-metropoliaSupportRed hover:bg-red-900'
												: 'bg-metropoliaTrendGreen hover:bg-green-700'
										} text-white`}
										onClick={() =>
											navigate(`/student/courses/attendance/${course.usercourseid}`)
										}
									>
										View your attendance
									</button>
								</div>
							</Tooltip>
						);
					})}
			</div>
		</div>
	);
};

export default StudentCourses;
