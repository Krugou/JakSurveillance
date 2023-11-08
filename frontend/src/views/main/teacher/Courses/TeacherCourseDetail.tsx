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
	topic_names: string[];
}

const TeacherCourseDetail: React.FC = () => {
	const [courseData, setCourseData] = useState<CourseDetail | null>(null);

	const {id} = useParams<{id: string}>();

	useEffect(() => {
		console.log(id);
		const fetchCourses = async () => {
			if (id) {
				const courseData = await apihooks.getCourseDetailByCourseId(id);
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
		<div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">My Single Course</div>
				{courseData && <CourseData courseData={courseData} />}
			</div>
		</div>
	);
};

export default TeacherCourseDetail;
