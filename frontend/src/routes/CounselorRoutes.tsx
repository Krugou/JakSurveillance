import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CounselorMainView from '../views/main/counselor/CounselorMainView.tsx';
import CounselorProfile from '../views/main/counselor/CounselorProfile.tsx';
import CounselorHelpVideos from '../views/main/counselor/CounselorHelpVideos.tsx';
import CounselorStudentRoutes from './counselor/CounselorStudentRoutes.tsx';
import CounselorCourseStats from '../views/main/counselor/CounselorCourseStats.tsx';
/**
 * CounselorRoutes component.
 * This component is responsible for defining the routes for the counselor section of the application.
 * It includes routes for the main view, profile, help videos, course statistics, and student routes.
 * Each route is associated with a specific component that will be rendered when the route is accessed.
 * The '*' route is a catch-all route that will render the CounselorMainView component if no other routes match.
 *
 * @returns {JSX.Element} The rendered CounselorRoutes component.
 */
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
