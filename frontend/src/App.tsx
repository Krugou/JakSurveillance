import React from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {useRegisterSW} from 'virtual:pwa-register/react';
import AdminRoutes from './routes/AdminRoutes';
import CounselorRoutes from './routes/CounselorRoutes';
import StudentRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import Footer from './views/Footer.tsx';
import Header from './views/Header.tsx';
import StartView from './views/main/StartView.tsx';
import {UserProvider} from './contexts/UserContext.tsx';
const intervalMS = 60 * 60 * 1000;
const App = () => {
	useRegisterSW({
		onRegistered(r) {
			if (r) {
				console.log('Service worker registered successfully');
				setInterval(() => {
					r.update();
				}, intervalMS);
			} else {
				console.log('Service worker registration failed');
			}
		},
	});

	return (
		<UserProvider>
			<Router basename={import.meta.env.BASE_URL}>
				<Header title="Attendance App" />
				<main>
					<Routes>
						<Route path="/" element={<StartView />} />
						<Route path="student/*" element={<StudentRoutes />} />
						<Route path="admin/*" element={<AdminRoutes />} />
						<Route path="counselor/*" element={<CounselorRoutes />} />
						<Route path="teacher/*" element={<TeacherRoutes />} />
					</Routes>
				</main>
				<Footer />
			</Router>
		</UserProvider>
	);
};

export default App;
