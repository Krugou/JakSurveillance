// routes/TeacherStudentsRoutes.tsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import TeacherStudentAttendances from '../../views/main/teacher/Students/TeacherStudentAttendances';
import TeacherStudentDetail from '../../views/main/teacher/Students/TeacherStudentDetail.tsx';
import TeacherStudentModify from '../../views/main/teacher/Students/TeacherStudentModify.tsx';
import TeacherStudentsView from '../../views/main/teacher/Students/TeacherStudentsView.tsx';
import TeacherMainView from '../../views/main/teacher/TeacherMainView.tsx';

const TeacherStudentsRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<TeacherStudentsView />} />
			<Route path=":id" element={<TeacherStudentDetail />} />
			<Route path=":id/modify" element={<TeacherStudentModify />} />
			<Route path=":id/attendances/" element={<TeacherStudentAttendances />} />
			<Route path="*" element={<TeacherMainView />} />
		</Routes>
	);
};

export default TeacherStudentsRoutes;
