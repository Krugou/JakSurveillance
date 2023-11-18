import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CounselorStudentsView from '../../views/main/counselor/students/CounselorStudentsView';
import CounselorMainView from '../../views/main/counselor/CounselorMainView';

const CounselorStudentRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<CounselorStudentsView />} />
			<Route path=":id" element={<CounselorStudentsView />} />
			<Route path=":id/modify" element={<CounselorStudentsView />} />
			<Route path="*" element={<CounselorMainView />} />
		</Routes>
	);
};

export default CounselorStudentRoutes;
