import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminSettings from '../../views/main/admin/AdminSettings';
import AdminMainView from '../../views/main/admin/AdminMainView';

const AdminSettingsRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<AdminSettings />} />
			<Route path="*" element={<AdminMainView />} />
		</Routes>
	);
};

export default AdminSettingsRoutes;
