import React, {useContext, useEffect, useState} from 'react';
import CourseData from '../../../../components/main/course/CourseData';
import {UserContext} from '../../../../contexts/UserContext';
import apihooks from '../../../../hooks/ApiHooks';
import BackgroundContainer from "../../../../components/main/background/background";
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
		<BackgroundContainer>
			<h2 className="font-bold text-lg">My courses</h2>
			<div className="w-full sm:w-3/4 md:w-2/4 lg:w-2/5 2xl:w-1/5">
				<CourseData courseData={courses} />
			</div>
		</BackgroundContainer>
	);
};

export default TeacherCourses;
