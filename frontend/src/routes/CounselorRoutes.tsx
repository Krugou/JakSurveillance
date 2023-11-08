import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from '../views/main/Login.tsx';
import CounselorMainView from '../views/main/counselor/CounselorMainView.tsx';

const CounselorRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<CounselorMainView />} />
		</Routes>
	);
};

export default CounselorRoutes;
