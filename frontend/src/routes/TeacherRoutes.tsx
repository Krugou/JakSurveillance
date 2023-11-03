import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import TeacherMainView from '../views/main/teacher/TeacherMainView.tsx';
import TeacherAttendanceRoutes from './teacher/TeacherAttendanceRoutes';
import TeacherCoursesRoutes from './teacher/TeacherCoursesRoutes';
import TeacherStudentsRoutes from './teacher/TeacherStudentsRoutes';
import TeacherHelpVideos from "../views/main/teacher/TeacherHelpVideos";



const TeacherRoutes = () => {
    return (
        <Routes>
            <Route
                path='login'
                element={
                    <Login userType='Teacher'

                    />
                }
            />
            <Route path='mainview' element={<TeacherMainView />} />
            <Route path='helpvideos' element={<TeacherHelpVideos />} />
            <Route path='courses/*' element={<TeacherCoursesRoutes />} />
            <Route path='students/*' element={<TeacherStudentsRoutes />} />
            <Route path='attendance/*' element={<TeacherAttendanceRoutes />} />
        </Routes>
    );
};

export default TeacherRoutes;
