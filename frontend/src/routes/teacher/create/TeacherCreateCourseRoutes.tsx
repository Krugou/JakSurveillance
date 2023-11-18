import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CreateCourseCustom from '../../../components/main/course/CreateCourseCustom.tsx';
import CreateCourseEasy from '../../../components/main/course/CreateCourseEasy.tsx';
import TeacherCreateCourse from '../../../views/main/teacher/Courses/TeacherCreateCourse.tsx';
import TeacherMainView from '../../../views/main/teacher/TeacherMainView.tsx';
const TeacherCreateCourseRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<TeacherCreateCourse />} />
			<Route path="easy" element={<CreateCourseEasy />} />
			<Route path="custom" element={<CreateCourseCustom />} />
			<Route path="*" element={<TeacherMainView />} />
		</Routes>
	);
};

export default TeacherCreateCourseRoutes;
