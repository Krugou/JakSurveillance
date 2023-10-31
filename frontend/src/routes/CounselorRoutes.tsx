import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import CounselorMainView from '../views/main/counselor/CounselorMainView.tsx';

interface CounselorRoutesProps {
    handleLogin: (userType: string) => Promise<void>;
}

const CounselorRoutes: React.FC<CounselorRoutesProps> = () => {
    return (
        <Routes>
            <Route
                path='login'
                element={
                    <Login
                        userType='Counselor'
                    />
                }
            />
            <Route path='mainview' element={<CounselorMainView />} />
        </Routes>
    );
};

export default CounselorRoutes;