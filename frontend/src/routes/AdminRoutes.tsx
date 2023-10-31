import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import AdminMainView from '../views/main/admin/AdminMainView.tsx';

interface AdminRoutesProps {
    handleLogin: (userType: string) => Promise<void>;
}

const AdminRoutes: React.FC<AdminRoutesProps> = () => {
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