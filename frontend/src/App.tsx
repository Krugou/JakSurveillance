import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRegisterSW} from 'virtual:pwa-register/react';
import {UserProvider} from './contexts/UserContext.tsx';
import AllRoutes from './routes/AllRoutes.tsx';

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
				console.log('test line');
				// Update service worker every hour
				setInterval(() => {
					console.log('Updating service worker registration');
					r.update();
				}, intervalMS);
			} else {
				console.log('Service worker registration failed');
			}
		},
	});

	return (
		<UserProvider>
			<ToastContainer hideProgressBar={true} />
			<Router basename={import.meta.env.BASE_URL}>
				<AllRoutes />
			</Router>
		</UserProvider>
	);
};

export default App;
