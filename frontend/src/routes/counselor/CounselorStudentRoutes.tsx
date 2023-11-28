import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CounselorStudentsView from '../../views/main/counselor/students/CounselorStudentsView';
import CounselorStudentDetail from '../../views/main/counselor/students/CounselorStudentDetail';
import CounselorMainView from '../../views/main/counselor/CounselorMainView';
import CounselorStudentAttendances from '../../views/main/counselor/students/CounselorStudentAttendances';
const CounselorStudentRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<CounselorStudentsView />} />
			<Route path=":id" element={<CounselorStudentDetail />} />
			<Route path="*" element={<CounselorMainView />} />
			<Route
				path="attendance/:usercourseid"
				element={<CounselorStudentAttendances />}
			/>
		</Routes>
	);
};

export default CounselorStudentRoutes;
