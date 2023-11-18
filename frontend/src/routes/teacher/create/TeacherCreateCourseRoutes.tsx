import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CreateCourseCustom from '../../../components/main/course/CreateCourseCustom.tsx';
import CreateCourseEasy from '../../../components/main/course/CreateCourseEasy.tsx';
import TeacherCreateCourse from '../../../views/main/teacher/Courses/TeacherCreateCourse.tsx';
const TeacherCreateCourseRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<TeacherCreateCourse />} />
			<Route path="easy" element={<CreateCourseEasy />} />
			<Route path="custom" element={<CreateCourseCustom />} />
		</Routes>
	);
};

export default TeacherCreateCourseRoutes;
