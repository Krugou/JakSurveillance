import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminSettings from '../../views/main/admin/AdminSettings';
import AdminMainView from '../../views/main/admin/AdminMainView';
/**
 * AdminSettingsRoutes component.
 * This component is responsible for defining the routes for the admin's settings section of the application.
 * It includes routes for the settings view and the main view.
 * Each route is associated with a specific component that will be rendered when the route is accessed.
 * The '*' route is a catch-all route that will render the AdminMainView component if no other routes match.
 *
 * @returns {JSX.Element} The rendered AdminSettingsRoutes component.
 */
const AdminSettingsRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<AdminSettings />} />
			<Route path="*" element={<AdminMainView />} />
		</Routes>
	);
};

export default AdminSettingsRoutes;
