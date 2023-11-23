import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminMainView from '../../views/main/admin/AdminMainView';
import AdminUsers from '../../views/main/admin/AdminUsers';

const AdminUserRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<AdminUsers />} />
			<Route path="*" element={<AdminMainView />} />
		</Routes>
	);
};

export default AdminUserRoutes;
