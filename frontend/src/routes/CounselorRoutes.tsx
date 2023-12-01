import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CounselorMainView from '../views/main/counselor/CounselorMainView.tsx';
import CounselorProfile from '../views/main/counselor/CounselorProfile.tsx';
import CounselorHelpVideos from '../views/main/counselor/CounselorHelpVideos.tsx';
import CounselorStudentRoutes from './counselor/CounselorStudentRoutes.tsx';
import CounselorCourseStats from '../views/main/counselor/CounselorCourseStats.tsx';
const CounselorRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<CounselorMainView />} />
			<Route path="*" element={<CounselorMainView />} />
			<Route path="profile" element={<CounselorProfile />} />
			<Route path="helpvideos" element={<CounselorHelpVideos />} />
			<Route path="courses/stats/:courseid?" element={<CounselorCourseStats />} />
			<Route path="students/*" element={<CounselorStudentRoutes />} />
		</Routes>
	);
};

export default CounselorRoutes;
