import React, {useEffect} from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRegisterSW} from 'virtual:pwa-register/react';
import BackgroundContainer from './components/main/background/BackgroundContainer.tsx';
import {UserProvider} from './contexts/UserContext.tsx';
import AdminRoutes from './routes/AdminRoutes';
import CounselorRoutes from './routes/CounselorRoutes';
import StudentRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import Footer from './views/Footer.tsx';
import Header from './views/Header.tsx';
import Logout from './views/Logout.tsx';
import Gdpr from './views/main/Gdpr';
import Login from './views/main/Login.tsx';
import StartView from './views/main/StartView.tsx';
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
	useEffect(() => {
		const title = window.location.pathname.split('/').filter(Boolean).join('/');
		document.title = title ? `JakSec - ${title}` : 'JakSec';
	}, []);

	return (
		<UserProvider>
			<ToastContainer />
			<Router basename={import.meta.env.BASE_URL}>
				<Header title="Attendance App" />
				<div className="flex flex-col min-h-screen">
					<BackgroundContainer>
						<main className="flex-grow">
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
						</main>
					</BackgroundContainer>
					<Footer />
				</div>
			</Router>
		</UserProvider>
	);
};

export default App;
