import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CounselorMainView from '../views/main/counselor/CounselorMainView.tsx';
import CounselorProfile from '../views/main/counselor/CounselorProfile.tsx';
import CounselorHelpVideos from '../views/main/counselor/CounselorHelpVideos.tsx';
const CounselorRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<CounselorMainView />} />
			<Route path="*" element={<CounselorMainView />} />
			<Route path="profile" element={<CounselorProfile />} />
			<Route path="helpvideos" element={<CounselorHelpVideos />} />
		</Routes>
	);
};

export default CounselorRoutes;
