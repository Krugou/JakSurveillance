import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminSettings from '../../views/main/admin/AdminSettings';

const AdminSettingsRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<AdminSettings />} />
		</Routes>
	);
};

export default AdminSettingsRoutes;
