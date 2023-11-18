import { Route, Routes } from 'react-router-dom';
import React from 'react';
import AdminUsers from "../../views/main/admin/Users/AdminUsers";
import AdminMainView from '../../views/main/admin/AdminMainView';


const AdminUserRoutes: React.FC = () => {
    return (
					<Routes>
						<Route path="/" element={<AdminUsers />} />
						<Route path="*" element={<AdminMainView />} />
					</Routes>
				);
};

export default AdminUserRoutes;
