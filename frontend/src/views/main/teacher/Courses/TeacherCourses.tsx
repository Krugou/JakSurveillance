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

	useEffect(() => {
		const fetchCourses = async () => {
			if (user) {
				const courses = await apihooks.getAllCoursesByInstructorEmail(user.email);
				console.log(
					'🚀 ~ file: TeacherCourses.tsx:25 ~ fetchCourses ~ courses:',
					courses,
				);

				setCourses(courses);
			}
		};

		fetchCourses();
	}, [user]);

	return (
		<div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">My courses</div>
				<CourseData courseData={courses} />
			</div>
		</div>
	);
};

export default TeacherCourses;
