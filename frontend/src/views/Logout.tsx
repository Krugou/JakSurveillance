import React, {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../contexts/UserContext';

const Logout = () => {
	const navigate = useNavigate();
	const {setUser} = useContext(UserContext);

	localStorage.removeItem('userToken');
	setUser(null);

	// Delay the navigation by 1 second
	setTimeout(() => {
		navigate('/');
	}, 1200);

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="loader w-24 h-24 border-t-4 border-blue-500 rounded-full animate-spin"></div>
			<p className="text-center">Logging out...</p>
		</div>
	);
};

export default Logout;
