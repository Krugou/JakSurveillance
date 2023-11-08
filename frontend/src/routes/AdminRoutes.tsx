import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminMainView from '../views/main/admin/AdminMainView.tsx';
import AdminCoursesRoutes from './admin/AdminCourseRoutes';
import AdminUserRoutes from './admin/AdminUserRoutes';

const AdminRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<AdminMainView />} />
			<Route path="courses/*" element={<AdminCoursesRoutes />} />
			<Route path="users/*" element={<AdminUserRoutes />} />
		</Routes>
	);
};

export default AdminRoutes;
