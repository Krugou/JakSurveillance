import { Route, Routes } from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import AdminMainView from '../views/main/admin/AdminMainView.tsx';
import React from 'react';

interface AdminRoutesProps {
    handleLogin: (userType: string, username: string, password: string) => Promise<void>;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ handleLogin }) => {
    return (
        <Routes>
            <Route
                path='login'
                element={
                    <Login
                        userType='Admin'
                        onLogin={(username, password) =>
                            handleLogin('Admin', username, password)
                        }
                    />
                }
            />
            <Route path='mainview' element={<AdminMainView />} />
        </Routes>
    );
};

export default AdminRoutes;