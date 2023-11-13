import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';

const StudentCourses: React.FC = () => {
	interface Course {
		courseid: number;
		name: string;
		startDate: string;
		endDate: string;
		code: string;
		student_group: number | null;
		topic_names: string;
		instructor_name: string;
	}
	const [error, setError] = useState<string | null>(null);
	const {user} = useContext(UserContext);
	const [courses, setCourses] = useState<Course[]>([]);
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
			<h1 className="text-2xl sm:text-5xl font-bold mb-8 text-center">
				Student Course Attendance
			</h1>
			<div className="flex flex-row">
				{courses.map(course => (
					<div
						key={course.courseid}
						className="w-full max-w-md p-6 m-2 bg-white shadow-md rounded-lg"
					>
						<h2 className="text-xl font-bold mb-2 text-indigo-600">{course.name}</h2>
						<p className="mb-1">
							<strong>Start Date:</strong> {course.startDate}
						</p>
						<p className="mb-1">
							<strong>End Date:</strong> {course.endDate}
						</p>
						<p className="mb-1">
							<strong>Code:</strong> {course.code}
						</p>
						<p className="mb-1">
							<strong>Instructor:</strong> {course.instructor_name}
						</p>
						<p className="mb-1">
							<strong>Topics:</strong> {course.topic_names}
						</p>
						<p className="mb-1">
							<strong>Student Group:</strong> {course.student_group || 'None'}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default StudentCourses;
