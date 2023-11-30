import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminHelpVideos from '../views/main/admin/AdminHelpVideos.tsx';
import AdminMainView from '../views/main/admin/AdminMainView.tsx';
import AdminProfile from '../views/main/admin/AdminProfile.tsx';
import AdminStats from '../views/main/admin/AdminStats.tsx';
import AdminCoursesRoutes from './admin/AdminCourseRoutes';
import AdminSettingsRoutes from './admin/AdminSettingsRoutes.tsx';
import AdminUserRoutes from './admin/AdminUserRoutes';
const AdminRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<AdminMainView />} />
			<Route path="courses/*" element={<AdminCoursesRoutes />} />
			<Route path="users/*" element={<AdminUserRoutes />} />
			<Route path="profile" element={<AdminProfile />} />
			<Route path="helpvideos" element={<AdminHelpVideos />} />
			<Route path="settings/*" element={<AdminSettingsRoutes />} />
			<Route path="*" element={<AdminMainView />} />
			<Route path="stats" element={<AdminStats />} />
		</Routes>
	);
};

export default AdminRoutes;
