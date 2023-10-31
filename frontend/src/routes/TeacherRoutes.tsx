import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import TeacherMainView from '../views/main/teacher/TeacherMainView.tsx';
import TeacherAttendanceRoutes from './teacher/TeacherAttendanceRoutes';
import TeacherCoursesRoutes from './teacher/TeacherCoursesRoutes';
import TeacherStudentsRoutes from './teacher/TeacherStudentsRoutes';

interface TeacherRoutesProps {
    handleLogin: (userType: string, username: string, password: string) => Promise<void>;
}

const TeacherRoutes: React.FC<TeacherRoutesProps> = ({ handleLogin }) => {
    return (
        <Routes>
            <Route
                path='login'
                element={
                    <Login
                        userType='Teacher'
                        onLogin={(username, password) =>
                            handleLogin('Teacher', username, password)
                        }
                    />
                }
            />
            <Route path='mainview' element={<TeacherMainView />} />
            <Route path='courses/*' element={<TeacherCoursesRoutes />} />
            <Route path='students/*' element={<TeacherStudentsRoutes />} />
            <Route path='attendance/*' element={<TeacherAttendanceRoutes />} />
        </Routes>
    );
};

export default TeacherRoutes;