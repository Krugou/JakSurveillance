import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TeacherAttendanceRoom from '../../views/main/teacher/Attendance/TeacherAttendanceRoom.tsx';
import TeacherCreateAttendance from '../../views/main/teacher/Attendance/TeacherCreateAttendance.tsx';

const TeacherAttendanceRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='createattendance' element={<TeacherCreateAttendance />} />
            <Route path='attendance' element={<TeacherAttendanceRoom />} />
        </Routes>
    );
};

export default TeacherAttendanceRoutes;