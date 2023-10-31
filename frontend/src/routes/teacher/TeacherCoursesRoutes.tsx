import { Route, Routes } from 'react-router-dom';
import React from 'react';
import TeacherCourseDetail from '../../views/main/teacher/Courses/TeacherCourseDetail.tsx';
import TeacherCourseModify from '../../views/main/teacher/Courses/TeacherCourseModify.tsx';
import TeacherCourses from '../../views/main/teacher/Courses/TeacherCourses.tsx';
import TeacherCreateCourse from '../../views/main/teacher/Courses/TeacherCreateCourse.tsx';

const TeacherCoursesRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<TeacherCourses />} />
            <Route path='createcourse' element={<TeacherCreateCourse />} />
            <Route path=':id' element={<TeacherCourseDetail />} />
            <Route path=':id/modify' element={<TeacherCourseModify />} />
        </Routes>
    );
};

export default TeacherCoursesRoutes;