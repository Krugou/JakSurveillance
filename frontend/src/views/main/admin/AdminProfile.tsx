import React, {useContext} from 'react';
import {UserContext} from '../../../contexts/UserContext';
import {useNavigate} from 'react-router-dom'; // Import useNavigate
import ProfileInfo from '../../../components/profiles/ProfileInfo';
const AdminProfile: React.FC = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate(); // Initialize useNavigate

	// Error handling
	if (!user) {
		return <div>No user data available.</div>;
	}

	return (
		<div className="flex flex-col items-center justify-center h-1/2 p-10 bg-gray-100 font-sans">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Admin Profile</h1>
			<div className="text-md sm:text-xl mb-4">
				<ProfileInfo user={user} />
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
