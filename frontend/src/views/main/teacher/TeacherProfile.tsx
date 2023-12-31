import React, {useContext, useEffect, useState} from 'react';
import ProfileInfo from '../../../components/profiles/ProfileInfo';
import {UserContext} from '../../../contexts/UserContext';

import {CircularProgress} from '@mui/material';
import {useNavigate} from 'react-router-dom'; // Import useNavigate
/**
 * TeacherProfile component.
 * This component is responsible for rendering the profile of a teacher.
 * It uses the UserContext to get the current user and displays a loading spinner until the user data is available.
 * It also provides a button to navigate to the teacher's courses.
 */
const TeacherProfile: React.FC = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate(); // Initialize useNavigate
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (user) {
			setIsLoading(false);
		}
	}, [user]);

	if (isLoading) {
		return <CircularProgress />;
	}

	if (!user) {
		return <div>No user data available.</div>;
	}

	return (
		<div className="flex flex-col w-11/12 sm:w-fit items-center justify-center h-fit p-5 sm:p-10 bg-white rounded-lg font-sans">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Teacher Profile</h1>
			<div className="text-md sm:text-xl mb-4">
				<ProfileInfo user={user} />
			</div>
			<button
				className="px-4 py-2 mt-4 bg-metropoliaMainOrange transition text-white rounded hover:bg-metropoliaSecondaryOrange"
				onClick={() => navigate('/teacher/courses')}
			>
				My Courses
			</button>
		</div>
	);
};

export default TeacherProfile;
