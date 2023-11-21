import {CircularProgress} from '@mui/material';
import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {UserContext} from '../../../contexts/UserContext.tsx';



const StudentGdpr = () => {
	const {user, setUser} = useContext<User | null>(UserContext);

	const navigate = useNavigate();

	const handleAccept = () => {
		toast.success('GDPR accepted thank you!');
		navigate('/student/mainview');
	};
	const handleDecline = () => {
		toast.success('GDPR declined bye!');
		localStorage.removeItem('userToken');
		setUser(null);
		navigate('/');
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			{user?.gdpr === 0 ? (
				<div className="p-6 m-4 bg-white rounded shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
					<p className="mb-4 text-lg font-semibold">
						Do you accept the GDPR terms for your student account?
					</p>
					<button
						type="button"
						onClick={handleAccept}
						className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
					>
						Accept
					</button>
					<button
						onClick={handleDecline}
						type="button"
						className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
					>
						Decline
					</button>
				</div>
			) : (
				<CircularProgress />
			)}
		</div>
	);
};

export default StudentGdpr;
