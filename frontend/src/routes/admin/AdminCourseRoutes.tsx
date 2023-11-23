import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminCourses from '../../views/main/admin/AdminCourses';
import AdminMainView from '../../views/main/admin/AdminMainView';
import AdminCourseDetail from '../../views/main/admin/Courses/AdminCourseDetail';
import AdminCourseModify from '../../views/main/admin/Courses/AdminCourseModify';

const AdminCoursesRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<AdminCourses />} />
			<Route path=":id" element={<AdminCourseDetail />} />
			<Route path=":id/modify" element={<AdminCourseModify />} />
			<Route path="*" element={<AdminMainView />} />
		</Routes>
	);
};

export default AdminCoursesRoutes;
