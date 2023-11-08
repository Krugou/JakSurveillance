import { Route, Routes } from 'react-router-dom';
import React from 'react';
import AdminUsers from "../../views/main/admin/Users/AdminUsers";


const AdminUserRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<AdminUsers />} />
        </Routes>
    );
};

export default AdminUserRoutes;
