import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TeacherAttendanceRoom from '../../views/main/teacher/Attendance/TeacherAttendanceRoom.tsx';
import TeacherCreateLecture from '../../views/main/teacher/Attendance/TeacherCreateLecture.tsx';

const TeacherAttendanceRoutes: React.FC = () => {
    return (
					<Routes>
						<Route path="createlecture" element={<TeacherCreateLecture />} />
						<Route path=":classid" element={<TeacherAttendanceRoom />} />
					</Routes>
				);
};

export default TeacherAttendanceRoutes;
