import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import MainViewButton from '../../../../components/main/buttons/MainViewButton';
import CourseData from '../../../../components/main/course/CourseData';
import apihooks from '../../../../hooks/ApiHooks';
// this is view for teacher to see the single course details
const TeacherCourseDetail: React.FC = () => {
	const [courseDetail, setCourseDetail] = useState<any>([]);
	const {id} = useParams<{id: string}>();

	// Replace with actual data fetching
	useEffect(() => {
		console.log(id);
		const fetchCourses = async () => {
			const courseDetail = await apihooks.getCourseDetailByCourseId(id);
			console.log(
				'🚀 ~ file: TeacherCourses.tsx:14 ~ fetchCourses ~ courses:',
				courseDetail,
			);
			setCourseDetail(courseDetail);
		};

		fetchCourses();
	}, [id]);

	return (
		<div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">My Single Course</div>
				<CourseData courseData={courseDetail} />
			</div>
		</div>
	);
};

export default TeacherCourseDetail;
