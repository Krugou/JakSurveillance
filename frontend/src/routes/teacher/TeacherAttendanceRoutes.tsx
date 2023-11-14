import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TeacherAttendanceRoom from '../../views/main/teacher/Attendance/TeacherAttendanceRoom.tsx';
import TeacherCreateClass from '../../views/main/teacher/Attendance/TeacherCreateClass.tsx';

const TeacherAttendanceRoutes: React.FC = () => {
    return (
					<Routes>
						<Route path="createclass" element={<TeacherCreateClass />} />
						<Route path=":classid" element={<TeacherAttendanceRoom />} />
					</Routes>
				);
};

export default TeacherAttendanceRoutes;
