import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import StudentAttendance from '../views/main/student/StudentAttendance.tsx';
import StudentCourses from '../views/main/student/StudentCourses.tsx';
import StudentMainView from '../views/main/student/StudentMainView.tsx';
import StudentProfile from '../views/main/student/StudentProfile.tsx';

interface StudentRoutesProps {
    handleLogin: (userType: string, username: string, password: string) => Promise<void>;
}

const StudentRoutes: React.FC<StudentRoutesProps> = ({ handleLogin }) => {
    return (
        <Routes>
            <Route
                path='login'
                element={
                    <Login
                        userType='Student'
                        onLogin={async (username, password) =>
                            await handleLogin('Student', username, password)
                        }
                    />
                }
            />
            <Route path='mainview' element={<StudentMainView />} />
            <Route path='courses' element={<StudentCourses />} />
            <Route path='profile' element={<StudentProfile />} />
            <Route path='attendance' element={<StudentAttendance />} />
        </Routes>
    );
};

export default StudentRoutes;