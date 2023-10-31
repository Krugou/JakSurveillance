import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import StudentAttendance from '../views/main/student/StudentAttendance.tsx';
import StudentCourses from '../views/main/student/StudentCourses.tsx';
import StudentMainView from '../views/main/student/StudentMainView.tsx';
import StudentProfile from '../views/main/student/StudentProfile.tsx';



const StudentRoutes= () => {
    return (
        <Routes>
            <Route
                path='login'
                element={
                    <Login
                        userType='Student'

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