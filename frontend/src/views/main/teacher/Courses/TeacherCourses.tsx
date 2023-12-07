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
		<div className="w-full">
			<h2 className="font-bold text-3xl p-3 bg-white w-fit ml-auto mr-auto rounded-lg text-center xl:text-4xl">My courses</h2>
			<div className="grid 2xl:w-3/4 md:w-full bg-gray-100 p-5 max-h-[30em] 2xl:max-h-[50em] overflow-y-scroll rounded-lg mt-5 sm:w-3/4 w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 m-auto">
				<CourseData courseData={courses} updateView={updateView} />
			</div>
		</div>
	);
};

export default TeacherCourses;
