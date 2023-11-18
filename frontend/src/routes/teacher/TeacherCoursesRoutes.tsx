import React from 'react';
import {Route, Routes} from 'react-router-dom';
import TeacherCourseDetail from '../../views/main/teacher/Courses/TeacherCourseDetail.tsx';
import TeacherCourseModify from '../../views/main/teacher/Courses/TeacherCourseModify.tsx';
import TeacherCourses from '../../views/main/teacher/Courses/TeacherCourses.tsx';
import TeacherMainView from '../../views/main/teacher/TeacherMainView.tsx';
import TeacherCreateCourseRoutes from './create/TeacherCreateCourseRoutes.tsx';

const TeacherCoursesRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<TeacherCourses />} />
			<Route path="create/*" element={<TeacherCreateCourseRoutes />} />
			<Route path=":id" element={<TeacherCourseDetail />} />
			<Route path=":id/modify" element={<TeacherCourseModify />} />
			<Route path="*" element={<TeacherMainView />} />
		</Routes>
	);
};

export default TeacherCoursesRoutes;
