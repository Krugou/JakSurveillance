import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { postLogin } from './hooks/apihooks.ts';
import Login from './views/Login.tsx';
import StartView from './views/StartView.tsx';

const intervalMS = 60 * 60 * 1000;

const App = () => {
	// Define a function to handle the login action
	const handleLogin = async (userType: string, username: string, password: string) => {
		console.log(userType, username, password);
		const inputs = { username, password };
		const data = await postLogin(inputs);
		console.log(data);
	};

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
		<Router basename={import.meta.env.BASE_URL}>
			<Routes>
				<Route
					path='/'
					element={<StartView />}
				/>
				<Route
					path='/student-login'
					element={
						<Login
							userType='Student'
							onLogin={(username, password) => handleLogin('Student', username, password)}
						/>
					}
				/>
				<Route
					path='/teacher-login'
					element={
						<Login
							userType='Teacher'
							onLogin={(username, password) => handleLogin('Teacher', username, password)}
						/>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
