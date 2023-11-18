import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminMainView from '../views/main/admin/AdminMainView.tsx';
import AdminCoursesRoutes from './admin/AdminCourseRoutes';
import AdminUserRoutes from './admin/AdminUserRoutes';
import AdminProfile from '../views/main/admin/AdminProfile.tsx';
import AdminSettingsRoutes from './admin/AdminSettingsRoutes.tsx';
const AdminRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<AdminMainView />} />
			<Route path="courses/*" element={<AdminCoursesRoutes />} />
			<Route path="users/*" element={<AdminUserRoutes />} />
			<Route path="profile" element={<AdminProfile />} />
			<Route path="settings/*" element={<AdminSettingsRoutes />} />
		</Routes>
	);
};

export default AdminRoutes;
