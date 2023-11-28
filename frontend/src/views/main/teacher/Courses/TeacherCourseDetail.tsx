import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import CourseData from '../../../../components/main/course/CourseData';
import apihooks from '../../../../hooks/ApiHooks';

// Define your course detail structure here
interface CourseDetail {
	courseid: string;
	name: string;
	description: string;
	start_date: Date;
	end_date: Date;
	code: string;
	studentgroup_name: string;
	created_at: string;
	topic_names: string[];
	user_count: number;
	instructor_name: string;
}

const TeacherCourseDetail: React.FC = () => {
	const {id} = useParams<{id: string}>();
	const [courseData, setCourseData] = useState<CourseDetail | null>(null);

	useEffect(() => {
		console.log(id);
		const fetchCourses = async () => {
			if (id) {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const courseData = await apihooks.getCourseDetailByCourseId(id, token);
				console.log(
					'🚀 ~ file: TeacherCourses.tsx:14 ~ fetchCourses ~ courses:',
					courseData,
				);
				setCourseData(courseData);
			}
		};

		fetchCourses();
	}, [id]);

	return (
		<>
			<h2 className="font-bold text-lg">My single course</h2>
			<div className="m-4 bg-white rounded-lg shadow-lg mx-auto w-full sm:w-3/4 md:w-2/4 lg:w-2/5 2xl:w-1/5">
				{courseData && <CourseData courseData={courseData} />}
			</div>
		</>
	);
};

export default TeacherCourseDetail;
