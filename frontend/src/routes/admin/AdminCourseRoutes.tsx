import { Route, Routes } from 'react-router-dom';
import React from 'react';
import AdminCourses from "../../views/main/admin/Courses/AdminCourses";
import AdminCourseModify from "../../views/main/admin/Courses/AdminCourseModify";


const AdminCoursesRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<AdminCourses />} />
            <Route path=':id/modify' element={<AdminCourseModify />} />
        </Routes>
    );
};

export default AdminCoursesRoutes;
