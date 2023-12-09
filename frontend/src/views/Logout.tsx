import CircularProgress from '@mui/material/CircularProgress';
import React, {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {UserContext} from '../contexts/UserContext';

/**
 * Logout component.
 * This component is responsible for logging out the user.
 * It removes the user token from local storage, sets the user context to null,
 * and then navigates back to the home page.
 */
const Logout = () => {
	// Hook to navigate programmatically
	const navigate = useNavigate();

	// User context
	const {setUser} = useContext(UserContext);

	// Effect hook to perform the logout operation
	useEffect(() => {
		// Remove the user token from local storage
		localStorage.removeItem('userToken');

		// Set the user context to null
		setUser(null);

		// Delay the navigation by 1 second
		setTimeout(() => {
			// Display a success toast message
			toast.success('Logged out successfully!');

			// Navigate back to the home page
			navigate('/');
		}, 1200);
	}, [navigate, setUser]);

	// Render a circular progress indicator while the logout operation is in progress
	return (
		<div className="flex justify-center items-center h-full">
			<CircularProgress color="primary" />
		</div>
	);
};

export default Logout;
