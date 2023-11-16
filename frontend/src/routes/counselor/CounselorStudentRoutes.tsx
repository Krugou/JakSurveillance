import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CounselorStudentsView from '../../views/main/counselor/students/CounselorStudentsView';

const CounselorStudentRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<CounselorStudentsView />} />
			<Route path=":id" element={<CounselorStudentsView />} />
			<Route path=":id/modify" element={<CounselorStudentsView />} />
		</Routes>
	);
};

export default CounselorStudentRoutes;
