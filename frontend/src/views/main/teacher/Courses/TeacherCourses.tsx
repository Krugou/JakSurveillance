import React, {useContext, useEffect, useState} from 'react';

import CourseData from '../../../../components/main/course/CourseData';
import {UserContext} from '../../../../contexts/UserContext';
import apihooks from '../../../../hooks/ApiHooks';

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

const TeacherCourses: React.FC = () => {
	const {user} = useContext(UserContext);
	const [courses, setCourses] = useState<Course[]>([]); // Specify the type for courses
	const {update, setUpdate} = useContext(UserContext);

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
		<>
			<h2 className="font-bold text-3xl xl:text-4xl">My courses</h2>
			<div className="w-full sm:w-3/4 md:w-2/4 lg:w-2/5 2xl:w-1/5">
				<CourseData courseData={courses} updateView={updateView} />
			</div>
		</>
	);
};

export default TeacherCourses;
