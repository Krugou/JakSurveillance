// routes/TeacherStudentsRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import TeacherStudentDetail from '../../views/main/teacher/Students/TeacherStudentDetail.tsx';
import TeacherStudentModify from '../../views/main/teacher/Students/TeacherStudentModify.tsx';
import TeacherStudentsView from '../../views/main/teacher/Students/TeacherStudentsView.tsx';
import TeacherStudentAttendances from "../../views/main/teacher/Students/TeacherStudentAttendances";

const TeacherStudentsRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<TeacherStudentsView />} />
            <Route path=':id' element={<TeacherStudentDetail />} />
            <Route path=':id/modify' element={<TeacherStudentModify />} />
            <Route path=':id/attendances/' element={<TeacherStudentAttendances />} />
        </Routes>
    );
};

export default TeacherStudentsRoutes;
