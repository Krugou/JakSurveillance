import { Route, Routes } from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import CounselorMainView from '../views/main/counselor/CounselorMainView.tsx';
import React from 'react';

interface CounselorRoutesProps {
    handleLogin: (userType: string, username: string, password: string) => Promise<void>;
}

const CounselorRoutes: React.FC<CounselorRoutesProps> = ({ handleLogin }) => {
    return (
        <Routes>
            <Route
                path='login'
                element={
                    <Login
                        userType='Counselor'
                        onLogin={(username, password) =>
                            handleLogin('Counselor', username, password)
                        }
                    />
                }
            />
            <Route path='mainview' element={<CounselorMainView />} />
        </Routes>
    );
};

export default CounselorRoutes;