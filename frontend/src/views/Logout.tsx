import CircularProgress from '@mui/material/CircularProgress';
import React, {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {UserContext} from '../contexts/UserContext';

const Logout = () => {
	const navigate = useNavigate();
	const {setUser} = useContext(UserContext);

	useEffect(() => {
		localStorage.removeItem('userToken');
		setUser(null);

		// Delay the navigation by 1 second
		setTimeout(() => {
			toast.success('Logged out successfully!');
			navigate('/');
		}, 1200);
	}, [navigate, setUser]);

	return (
		<div className="flex justify-center items-center h-full">
			<CircularProgress color="primary" />
		</div>
	);
};

export default Logout;
