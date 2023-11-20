import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CounselorMainView from '../views/main/counselor/CounselorMainView.tsx';
import CounselorProfile from '../views/main/counselor/CounselorProfile.tsx';

const CounselorRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<CounselorMainView />} />
			<Route path="*" element={<CounselorMainView />} />
			<Route path="profile" element={<CounselorProfile />} />
		</Routes>
	);
};

export default CounselorRoutes;
