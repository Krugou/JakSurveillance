import React from 'react';
import {Route, Routes} from 'react-router-dom';
import StudentAttendance from '../views/main/student/StudentAttendance.tsx';
import StudentCourses from '../views/main/student/StudentCourses.tsx';
import StudentMainView from '../views/main/student/StudentMainView.tsx';
import StudentProfile from '../views/main/student/StudentProfile.tsx';
import StudentQrScanner from '../views/main/student/StudentQrScanner.tsx';

const StudentRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<StudentMainView />} />
			<Route path="courses" element={<StudentCourses />} />
			<Route path="profile" element={<StudentProfile />} />
			<Route path="attendance" element={<StudentAttendance />} />
			<Route path="qr" element={<StudentQrScanner />} />
		</Routes>
	);
};

export default StudentRoutes;
