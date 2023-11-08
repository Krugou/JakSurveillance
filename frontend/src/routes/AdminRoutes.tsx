import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import AdminMainView from '../views/main/admin/AdminMainView.tsx';
import AdminCoursesRoutes from "./admin/AdminCourseRoutes";
import AdminUserRoutes from "./admin/AdminUserRoutes";


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
            <Route path='courses/*' element={<AdminCoursesRoutes/>} />
            <Route path='users/*' element={<AdminUserRoutes/>} />
        </Routes>
    );
};

export default AdminRoutes;
