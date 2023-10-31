import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import AdminMainView from '../views/main/admin/AdminMainView.tsx';


const AdminRoutes = () => {
    return (
        <Routes>
            <Route
                path='login'
                element={
                    <Login
                        userType='Admin'
                    />
                }
            />
            <Route path='mainview' element={<AdminMainView />} />
        </Routes>
    );
};

export default AdminRoutes;