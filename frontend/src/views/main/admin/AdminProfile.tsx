import React, {useContext} from 'react';
import {UserContext} from '../../../contexts/UserContext';

import {useNavigate} from 'react-router-dom'; // Import useNavigate

const AdminProfile: React.FC = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate(); // Initialize useNavigate

	// Error handling
	if (!user) {
		return <div>No user data available.</div>;
	}

	return (
		<div className="flex flex-col items-center justify-center h-1/2 p-10 bg-gray-100 font-sans">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Student Profile</h1>
			<div className="text-md sm:text-xl mb-4">
				<p className="mb-5">
					<strong>Name:</strong> <span className="profileStat">{user.username}</span>
				</p>
				<p className="mb-5">
					<strong>Email:</strong> <span className="profileStat">{user.email}</span>
				</p>
				<p className="mb-5">
					<strong>role:</strong> <span className="profileStat">{user.role}</span>
				</p>
			</div>
			<button
				className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-700"
				onClick={() => navigate('/admin/courses')}
			>
				My Courses
			</button>
		</div>
	);
};

export default AdminProfile;
