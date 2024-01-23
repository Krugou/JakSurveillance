import React from 'react';
import {Route, Routes} from 'react-router-dom';
import TeacherHelpVideos from '../views/main/teacher/TeacherHelpVideos';
import TeacherMainView from '../views/main/teacher/TeacherMainView.tsx';
import TeacherProfile from '../views/main/teacher/TeacherProfile.tsx';
import TeacherAttendanceRoutes from './teacher/TeacherAttendanceRoutes';
import TeacherCoursesRoutes from './teacher/TeacherCoursesRoutes';
import TeacherStudentsRoutes from './teacher/TeacherStudentsRoutes';
import Feedback from '../views/main/Feedback.tsx';
/**
 * TeacherRoutes component.
 * This component is responsible for defining the routes for the teacher section of the application.
 * It includes routes for the main view, help videos, courses, students, attendance, and profile.
 * Each route is associated with a specific component that will be rendered when the route is accessed.
 * The '*' route is a catch-all route that will render the TeacherMainView component if no other routes match.
 *
 * @returns {JSX.Element} The rendered TeacherRoutes component.
 */
const TeacherRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<TeacherMainView />} />
			<Route path="helpvideos" element={<TeacherHelpVideos />} />
			<Route path="courses/*" element={<TeacherCoursesRoutes />} />
			<Route path="students/*" element={<TeacherStudentsRoutes />} />
			<Route path="attendance/*" element={<TeacherAttendanceRoutes />} />
			<Route path="profile" element={<TeacherProfile />} />
			<Route path="feedback" element={<Feedback />} />

			<Route path="*" element={<TeacherMainView />} />
		</Routes>
	);
};

export default TeacherRoutes;
