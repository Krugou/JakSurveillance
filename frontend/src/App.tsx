import React, {useEffect} from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRegisterSW} from 'virtual:pwa-register/react';
import BackgroundContainer from './components/main/background/BackgroundContainer';
import {UserProvider} from './contexts/UserContext.tsx';
import AdminRoutes from './routes/AdminRoutes';
import CounselorRoutes from './routes/CounselorRoutes';
import StudentRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import Logout from './views/Logout.tsx';
import Gdpr from './views/main/Gdpr';
import Login from './views/main/Login.tsx';
import StartView from './views/main/StartView.tsx';
// Interval for service worker updates
const intervalMS = 60 * 60 * 1000;

/**
 * Main application component.
 */
const App = () => {
	// Register service worker
	useRegisterSW({
		onRegistered(r) {
			if (r) {
				console.log('Service worker registered successfully');
				// Update service worker every hour
				setInterval(() => {
					console.log('Updating service worker');
					r.update();
				}, intervalMS);
			} else {
				console.log('Service worker registration failed');
			}
		},
	});

	// Update document title based on current path
	useEffect(() => {
		const title = window.location.pathname.split('/').filter(Boolean).join(' - ');
		document.title = title ? `JakSec - ${title}` : 'JakSec';
	}, []);

	return (
		<UserProvider>
			<ToastContainer hideProgressBar={true} />
			<Router basename={import.meta.env.BASE_URL}>
				<BackgroundContainer>
					<Routes>
						<Route path="/" element={<StartView />} />
						<Route path="student/*" element={<StudentRoutes />} />
						<Route path="admin/*" element={<AdminRoutes />} />
						<Route path="counselor/*" element={<CounselorRoutes />} />
						<Route path="teacher/*" element={<TeacherRoutes />} />
						<Route path="logout" element={<Logout />} />
						<Route path="login" element={<Login />} />
						<Route path="gdpr" element={<Gdpr />} />
					</Routes>
				</BackgroundContainer>
			</Router>
		</UserProvider>
	);
};

export default App;
