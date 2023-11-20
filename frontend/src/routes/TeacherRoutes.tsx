import React from 'react';
import {Route, Routes} from 'react-router-dom';
import TeacherMainView from '../views/main/teacher/TeacherMainView.tsx';
import TeacherAttendanceRoutes from './teacher/TeacherAttendanceRoutes';
import TeacherCoursesRoutes from './teacher/TeacherCoursesRoutes';
import TeacherStudentsRoutes from './teacher/TeacherStudentsRoutes';
import TeacherHelpVideos from '../views/main/teacher/TeacherHelpVideos';
import TeacherProfile from '../views/main/teacher/TeacherProfile.tsx';
const TeacherRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<TeacherMainView />} />
			<Route path="helpvideos" element={<TeacherHelpVideos />} />
			<Route path="courses/*" element={<TeacherCoursesRoutes />} />
			<Route path="students/*" element={<TeacherStudentsRoutes />} />
			<Route path="attendance/*" element={<TeacherAttendanceRoutes />} />
			<Route path="profile" element={<TeacherProfile />} />

			<Route path="*" element={<TeacherMainView />} />
		</Routes>
	);
};

export default TeacherRoutes;
