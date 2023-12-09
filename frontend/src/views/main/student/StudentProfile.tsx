import React, {useContext} from 'react';
import ProfileInfo from '../../../components/profiles/ProfileInfo';
import {UserContext} from '../../../contexts/UserContext';

import {useNavigate} from 'react-router-dom'; // Import useNavigate
/**
 * StudentProfile component.
 *
 * This component is responsible for rendering the profile of a student. It performs the following operations:
 *
 * 1. Fetches the user data from the UserContext.
 * 2. Renders the user's profile information using the ProfileInfo component.
 * 3. Renders the user's student group.
 * 4. Provides a button to navigate to the student's courses.
 *
 * If no user data is available, it renders a message indicating that no user data is available.
 *
 * @returns A JSX element representing the student profile component.
 */
const StudentProfile: React.FC = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate(); // Initialize useNavigate

	// Error handling
	if (!user) {
		return <div>No user data available.</div>;
	}

	return (
		<div className="flex flex-col items-center justify-center h-fit p-10 bg-white rounded-lg font-sans">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Student Profile</h1>
			<div className="text-md sm:text-xl mb-4">
				<ProfileInfo user={user} />
				<p className="mb-5 mt-5">
					<strong>Student Group:</strong>{' '}
					<span className="profileStat">{user.group_name}</span>
				</p>
			</div>
			<button
				className="px-4 py-2 mt-4 bg-metropoliaMainOrange transition text-white rounded hover:bg-metropoliaSecondaryOrange"
				onClick={() => navigate('/student/courses')} // Navigate to /student/courses when the button is clicked
			>
				My Courses
			</button>
		</div>
	);
};

export default StudentProfile;
